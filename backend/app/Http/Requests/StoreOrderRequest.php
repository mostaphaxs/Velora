<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Guests and signed-in customers can both place orders.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Only product slugs and quantities are accepted from the client; prices and
     * totals are always recalculated on the server.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $maxQuantity = config('store.max_quantity_per_item');

        return [
            'customer_name' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^(?:\+212|0)[5-7]\d{8}$/'],
            'city' => ['required', 'string', 'min:2', 'max:80'],
            'address' => ['required', 'string', 'min:5', 'max:255'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1', 'max:30'],
            'items.*.slug' => [
                'required',
                'string',
                'distinct',
                Rule::exists('products', 'slug')->where('is_active', true),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1', "max:{$maxQuantity}"],
        ];
    }

    /**
     * Normalise the phone number before validation, e.g. "06 12-34 56 78" -> "0612345678".
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('phone'))) {
            $this->merge(['phone' => preg_replace('/[\s.\-()]/', '', $this->input('phone'))]);
        }
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Please enter a valid Moroccan phone number, e.g. 0612345678.',
            'items.*.slug.exists' => 'One of the products in your cart is no longer available.',
        ];
    }
}
