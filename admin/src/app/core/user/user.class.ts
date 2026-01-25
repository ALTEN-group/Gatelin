import { FunctionalityAccessLevel } from "@core/roles/role.class";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { GeoCoordinates, INIT_COORDINATES } from "@form/utils/location.config";

export class User extends CrudItemBase implements GeoCoordinates {
  firstName = "";
  lastName = "";
  nickname = "";
  portrait = "";
  portrait_files: File[] = [];
  country = "";
  email = "";
  phone = "";
  token = "";
  rolesArrayAgg: number[] = [];
  active = true;
  updatedAt: number | null = null;
  updatedBy: { firstName: string; lastName: string } | null = null;

  /** Will store the functionality access levels for the logged user */
  accessLevels?: FunctionalityAccessLevel[];

  /** Address group */
  address: GeoCoordinates = INIT_COORDINATES;

  // geo coordinates
  location: [lng: number, lat: number] = [0, 0];
  street = "";
  zipCode = "";
  city = "";
  label = "";
}
