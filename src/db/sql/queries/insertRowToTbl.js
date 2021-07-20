const addUser = (
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  dateOfBirth
) => {
  return `INSERT INTO Users (Email, UserPassword, FirstName, LastName, PhoneNumber, DateOfBirth)
        VALUES
        (
            ${email},
            ${password},
            ${firstName},
            ${lastName},
            ${phoneNumber},
            ${dateOfBirth}
        )`;
};
