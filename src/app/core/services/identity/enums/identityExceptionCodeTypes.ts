enum IdentityExceptionCodeTypes
{
    NotFound = 1400,
    Unhandled = 1500,
    Exists = 1501,
    UserVerification = 1701,
    UserLockedOut = 1702,
    InvalidCredentials = 1703,
    InvalidToken = 1704,
    AlreadyEnabled = 1705,
    AlreadyDisabled = 1706,
    Validation = 1800,
    CompanyNotFound = 1900,
    CompanySeatsTaken = 1901,
    CompanyDisabled = 1902,
    InvalidPassword = 1903
}

export const IdentityExceptionMessages: { [key: number]: string } = {
    1400: "The requested resource was not found.",
    1500: "An unhandled error occurred.",
    1501: "The resource already exists.",
    1701: "User verification is required.",
    1702: "The user is locked out.",
    1703: "The provided credentials are invalid.",
    1704: "The provided token is invalid.",
    1705: "The feature is already enabled.",
    1706: "The feature is already disabled.",
    1800: "Validation error occurred.",
    1900: "The company was not found.",
    1901: "All company seats are taken.",
    1902: "The company is disabled.",
    1903: "Current Password Is Invalid.",
  };  