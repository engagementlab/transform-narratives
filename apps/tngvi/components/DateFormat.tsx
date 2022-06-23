type Props = {
    date: string
}

export default function DateFormat({ date }: Props) {
    return {
        weekday: new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
        })
    }
}