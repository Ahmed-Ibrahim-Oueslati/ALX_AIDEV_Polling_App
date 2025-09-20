Review and revise the AI-generated code using the provided OpenAPI specification.

Your tasks:

Verify that all required fields, parameters, and the overall request structure exactly match what’s defined in the spec.

Insert authentication headers or tokens wherever the spec indicates they are required.

Adjust the code so responses are handled according to the documented status codes (e.g., 200, 201, 400, 401, 500).

Ensure any errors (HTTP or parsing) are clearly logged or surfaced to the caller.

Confirm that the shapes of parsed responses exactly match the schemas in the spec.

Once the functions are working:
• Add concise docstrings to each function explaining its intent and input parameters.
• (Optional) Include a small test snippet or usage example showing how to call the function.

Output:
Provide the revised Python code using the requests library, with the improvements and docstrings applied.