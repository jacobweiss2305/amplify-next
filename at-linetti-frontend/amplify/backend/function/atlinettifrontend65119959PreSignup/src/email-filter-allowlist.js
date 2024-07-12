/**
 * AWS Lambda function to allow sign-up only for email addresses from "alphatheory.com".
 * @type {import('@types/aws-lambda').PreSignUpTriggerHandler}
 */
exports.handler = async (event) => {
  // Hardcoded domain for validation
  const allowedDomain = "alphatheory.com";

  // Extract the domain from the user's email address
  const { email } = event.request.userAttributes;
  const emailDomain = email.substring(email.indexOf('@') + 1);

  // Check if the extracted domain is "alphatheory.com"
  if (emailDomain !== allowedDomain) {
    throw new Error(`Invalid email.`);
  }

  // If the domain is valid, proceed with the sign-up process
  return event;
};