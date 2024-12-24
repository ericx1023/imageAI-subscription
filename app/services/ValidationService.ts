export class ValidationService {
  public static isValidModelName(name: string): boolean {
    const pattern = /^[a-z0-9][a-z0-9-._]*[a-z0-9]$|^[a-z0-9]$/;
    return pattern.test(name);
  }

  public static isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  public static formatModelName(name: string): string {
    let formatted = name.toLowerCase()
      .replace(/[^a-z0-9\-._]/g, '')
      .replace(/^[-._]+/, '')
      .replace(/[-._]+$/, '');
    
    return formatted || 'model';
  }
} 