import Form from "../components/Form"

function Login({ setUser }) {
    return <Form route="/api/token/" method="login" setUser={setUser}/>
}

export default Login;