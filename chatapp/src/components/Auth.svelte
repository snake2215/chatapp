<script>
    import {fade} from "svelte/transition";
    import ErrorAlert from "./ErrorAlert.svelte";

    export let authMode: "login" | "register" = "register";
    let isAuthenticated = false;
    let err: string | null = null;

    function login() {
        const email = (document.getElementById("l-email")).value;
        const password = (document.getElementById("l-password")).value;

        // basic form validation
        if (!email || !password) {
            err = "Fill out all fields!";
            return;
        }
        err = "";

        // sign in using firebase
        auth.signInWithEmailAndPassword(email, password).then(() => {d("done"); d("auth")}).catch(e => {
            err = `(${e.code}) ${e.message}`
        });
    }

    function register() {
        const email = (document.getElementById("r-email")).value;
        const password = (document.getElementById("r-password")).value;
        const cpassword = (document.getElementById("r-cpassword")).value;

        // form validation
        if (!email || !password || !cpassword) {
            err = "Fill out all fields!"
            return;
        }
        if (password !== cpassword) {
            err = "Passwords don't match!"
            return;
        }
        err = "";

        // creating the user
        auth.createUserWithEmailAndPassword(email, password).then(() => {d("done"); d("auth")}).catch(e => {
            err = `(${e.code}) ${e.message}`
        });
    }

    function logout() {
        if (auth.currentUser) {
            auth.signOut().then(() => {d("done"); d("logout")}).catch(e => {
                throw new Error(e);
            });
        }
    }

    auth.onAuthStateChanged(user => {
        isAuthenticated = !!user;
        if (user) d("auth")
    });
    
</script>

<div>
    {#if !isAuthenticated}
    <div>
        <h2>{authMode === "login" ? "Login" : "Register"} to Serverless Chat</h2>
    </div>
    <div>
        <div>
            <button on:click={() => authMode = "login"} {authMode === "login" && "w3-blue"}" style="width: 50%">LOGIN</button>
            <button on:click={() => authMode = "register"} {authMode === "register" && "w3-blue"}" style="width: 50%">REGISTER</button>
        </div>
        <!-- Email login/register forms -->
        {#if authMode === "login"}
            <form in:fade on:submit|preventDefault={login}>
                {#if err}
                <ErrorAlert message={err} />
                {/if}
                <h4>Login</h4>
                <p>
                    <label for="l-email">Email</label>
                    <input type="email"  placeholder="Enter your email" id="l-email">
                </p>
                <p>
                    <label for="l-password">Password</label>
                    <input type="password"  placeholder="Enter your password" id="l-password">
                </p>
                <p>
                    <button type="submit">Login</button>
                    <button on:click={() => authMode = "register"} type="button" >Register</button>
                </p>
            </form>
        {:else}
            <form in:fade on:submit|preventDefault={register}>
                {#if err}
                <ErrorAlert message={err} />
                {/if}
                <h4>Register</h4>
                <p>
                    <label for="r-email">Email</label>
                    <input type="email" placeholder="Enter your email" id="r-email">
                </p>
                <p>
                    <label for="r-password">Password</label>
                    <input type="password"  placeholder="Enter a password" id="r-password">
                </p>
                <p>
                    <label for="r-cpassword">Confirm Password</label>
                    <input type="password" placeholder="Re-enter that password" id="r-cpassword">
                </p>
                <p>
                    <button type="submit" class="w3-button w3-blue">Register</button>
                    <button on:click={() => authMode = "login"} type="button" >Login</button>
                </p>
            </form>
        {/if}
        <hr>
        <p>
            <button style="width: 100%" on:click={google}><i></i> Sign in with Google</button>
        </p>
    </div>
    {:else}
    <div>
        <h2>Logged in</h2>
    </div>
    <div>
        <p><i></i></p>
        <p>Logged in</p>
        <p>
            <button style="width: 100%" on:click={logout}>Log out</button>
        </p>
    </div>
    {/if}
</div>