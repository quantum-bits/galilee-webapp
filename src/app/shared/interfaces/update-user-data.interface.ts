export interface UpdateUserData {
  /**
   * this interface is used to specify the format for the attributes
   * that an admin can update for a user; these fields are a subset
   * of those specified in the user model; also, in the case of
   * permissions, only the ids of the various permissions are passed
   */
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  enabled?: boolean;
  preferredVersionId?: number;
  permissionIds?: Array<number>; //ids of the permissions that the user has
}
