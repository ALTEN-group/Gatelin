import { FunctionalityAccessLevel, Permission } from "@core/roles/role.class";
import {
  CrudItemBase,
  GeoCoordinates,
  INIT_COORDINATES,
} from "@dwtechs/crud-builder";

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
  permissions: Permission[] = [];
  active = true;

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
