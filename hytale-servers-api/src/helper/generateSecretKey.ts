import { randomUUID } from 'crypto';  

export function generateSecretKey(): string {
    return randomUUID();  
}