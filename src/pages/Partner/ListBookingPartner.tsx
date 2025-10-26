

interface values {
    sportArray: any
}

export default function ListBookingPartner({ sportArray }: values) {
    return <div>
        <pre>{JSON.stringify(sportArray, null, 2)}</pre>
    </div>
}