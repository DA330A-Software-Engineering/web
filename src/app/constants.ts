export default class Constants {
    static ip = "localhost"
    static port = "3000"
}

export function getLockButtonText(locked: boolean): string {
    return locked ? 'Unlock' : 'Lock';
  }

export function getOpenButtonText(open: boolean): string {
return open ? 'Close' : 'Open';
}

export function getOnButtonText(open: boolean): string {
    return open ? 'Turn off' : 'Turn on';
}
  
