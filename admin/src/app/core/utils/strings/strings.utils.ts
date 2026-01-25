export function interpolate<T>(string: string, values: T): string {
	return string.replace(/\{([^}]+)\}/g, (_, v) => {
		const valueProp = v as keyof T;
		const value = (values[valueProp] as number) ?? "";
		return value.toString();
	});
}
