export type LoginFieldType = {
  tenancyName?: string;
  userNameOrEmailAddress?: string;
  password?: string;
  rememberClient?: boolean;
};

export type RegisterFieldType = {
  tenancyName?: string;
  name?: string;
  surname?: string;
  userName?: string;
  emailAddress?: string;
  password?: string;
  confirmPassword?: string;
};
