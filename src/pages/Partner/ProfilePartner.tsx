export default function ProfilePartner({ user }: { user: any }) {
    return <div>
        <pre>
            <h3>profile partner</h3>
            {JSON.stringify(user, null, 2)}
        </pre>
    </div>
}