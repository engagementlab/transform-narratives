export function CreateKey(name: string) {
    return name.toLocaleLowerCase().replaceAll(/[^a-z+A-Z+0-9+]/ig, '-').replace(/-{2,}/g, '-')
}