# Small Loan Application — QA Checklist

## 1. Loan Calculator

- [ ] Verify calculator page is displayed.
- [ ] Verify default loan amount is 500 EUR.
- [ ] Verify default loan period is 12 months.
- [ ] Verify loan amount can be changed manually.
- [ ] Verify loan amount slider works correctly.
- [ ] Verify loan period can be changed.
- [ ] Verify loan period slider works correctly.
- [ ] Verify monthly payment is calculated.
- [ ] Verify monthly payment updates after changing loan parameters.
- [ ] Verify Apply Now button is enabled after successful calculation.
- [ ] Verify error handling when calculation API fails.

## 2. Input Validation

- [ ] Verify minimum loan amount (500 EUR).
- [ ] Verify maximum loan amount (10000 EUR).
- [ ] Verify loan amount below minimum (499 EUR).
- [ ] Verify loan amount above maximum.
- [ ] Verify minimum loan period (12 months).
- [ ] Verify maximum loan period (36 months).
- [ ] Verify invalid input handling.
- [ ] Verify empty input handling.

## 3. Login

- [ ] Verify login popup is displayed after clicking Apply Now.
- [ ] Verify username field is displayed.
- [ ] Verify password field is displayed.
- [ ] Verify Continue button is disabled when fields are empty.
- [ ] Verify Continue button becomes enabled when credentials are entered.
- [ ] Verify popup can be closed.
- [ ] Verify successful login.
- [ ] Verify behavior with incorrect credentials.

## 4. Loan Details

- [ ] Verify loan amount is displayed correctly.
- [ ] Verify monthly payment is displayed correctly.
- [ ] Verify loan period is displayed correctly.
- [ ] Verify customer information is displayed.
- [ ] Verify communication language can be changed.
- [ ] Verify Continue button navigates to Income page.

## 5. Income

- [ ] Verify Income page is displayed.
- [ ] Verify monthly income input is displayed.
- [ ] Verify Get Decision button is disabled when income is empty.
- [ ] Verify valid monthly income can be entered.
- [ ] Verify Get Decision button becomes enabled after entering income.
- [ ] Verify invalid income is rejected.
- [ ] Verify zero income handling.
- [ ] Verify negative income handling.
- [ ] Verify decimal income handling.

## 6. Loan Decision

- [ ] Verify approved loan decision.
- [ ] Verify rejected loan decision.
- [ ] Verify APPROVED result is displayed correctly.
- [ ] Verify REJECTED result is displayed correctly.
- [ ] Verify decision reason is displayed correctly.
- [ ] Verify OK button is displayed.
- [ ] Verify user can close the decision result.

## 7. API Testing

### Loan Calculation API

- [ ] Verify GET /api/loan-calc returns HTTP 200.
- [ ] Verify response contains paymentAmountMonthly.
- [ ] Verify monthly payment is greater than zero.
- [ ] Verify invalid loan amount returns HTTP 400.

### Loan Decisions API

- [ ] Verify POST /api/decisions returns HTTP 200.
- [ ] Verify approved decision response.
- [ ] Verify rejected decision response.
- [ ] Verify response contains decision ID.
- [ ] Verify response contains approved field.
- [ ] Verify response contains reason field.
- [ ] Verify response contains createdAt field.

## 8. Security and Access

- [ ] Verify protected pages cannot be accessed without completing the required flow.
- [ ] Verify direct navigation to loan decision page.
- [ ] Verify direct navigation to income page.
- [ ] Verify direct navigation to decision page.
- [ ] Verify request payload validation.
- [ ] Verify sensitive information is not exposed in URLs.

## 9. Error Handling

- [ ] Verify API error handling.
- [ ] Verify network failure handling.
- [ ] Verify application behavior during slow API responses.
- [ ] Verify invalid server responses are handled correctly.