import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { isArray, isDate, isNil } from "@dwtechs/checkard";

export class DocumentFormDataMapper {
  toFormData<T>(
    formValues: CrudItemBase & T,
    fileProperties: (keyof (CrudItemBase & T))[],
  ): FormData {
    const formData = new FormData();

    for (const itemKey in formValues) {
      const key = itemKey as keyof CrudItemBase;
      const value = formValues[key];
      // Check if file property
      if (fileProperties.includes(key)) {
        if (isNil(value)) {
          continue;
        }
        const files = isArray(value) ? value : [value];
        for (const file of files) {
          if (file instanceof File) {
            formData.append(key, file, file.name);
          }
        }
      } else {
        // Other property types
        formData.append(key, this.stringify(value));
      }
    }

    return formData;
  }

  private stringify(value: unknown): string {
    if (isNil(value)) {
      return "";
    }
    if (isDate(value)) {
      return new Date(value).toISOString();
    }
    return value.toString();
  }
}
