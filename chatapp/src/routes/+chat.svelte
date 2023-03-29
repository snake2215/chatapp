<script>
    import {auth, db} from "../services/firebase";
    import router from "page";
    import Chat from "../components/Chat.svelte";
    import {onDestroy} from "svelte";
    import { auth } from "../services/firebase";
    import router from "page";

    interface User {
        email: string, photoURL: string, uid: string
    }

    let user: User | null;

    auth.onAuthStateChanged(u => user = u);

    $: {
        // user === null is explicitly called instead of !user because we need firebase to decide what the user is, and not us, so we dont initialise user up there.
        if (user === null) router.redirect("/auth?action=login&next=%2Fchat");
    }

    function messageSubmit(e: KeyboardEvent & {
        currentTarget: EventTarget & HTMLInputElement;
    }) {
    }

    function logout() {
        if (auth.currentUser) {
            auth.signOut().then(() => {}).catch(e => {
                throw new Error(e)
            });
        }
    }


    const unsubscribe = db.collection("messages").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                messages = [...messages, change.doc.data() as Message]
                setTimeout(() => {if (document.getElementById("scroll-to")) document.getElementById("scroll-to").scrollIntoView({behavior: "smooth"});}, 500)
            }
        })
    })

    // calling the unsubscribe() method when the component gets destroyed to prevent listening to changes when not needed. Also, bandwith gets saved.
    onDestroy(unsubscribe);

    
</script>

{#if typeof user === "undefined"}
    <p><i></i> Loading</p>
{:else}
    {#if user}
        <h1>Serverless chat</h1>
        <p >Chatroom</p>
        <p ><button class="w3-button w3-blue" on:click={logout}>Logout</button></p>

        <br>
        <div style="margin: 0 auto; width: 60%; height: 600px; overflow-y: auto;">
            <br>
            {#if messages.length > 0}
                {#each messages as m}
                    <Chat {...m} self={user.uid === m.uid} />
                {/each}
            {:else}
                <p>Looks like nobody's sent a message. Be the first!</p>
            {/if}
            <!-- Dummy element used to scroll chat -->
            <br id="scroll-to">
        </div>
        <input on:keydown={messageSubmit} type="text" style="margin: 0 auto; width: 60%; margin-top: -1px" placeholder={cooldown ? "3 second cooldown" : "Enter message and press enter"} class="w3-input w3-border w3-border-gray {cooldown && "w3-pale-red"}" id="message-input">
        <br>
    {:else}
        <p>Not logged in!</p>
    {/if}
{/if}