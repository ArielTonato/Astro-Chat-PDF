<script>
    /*Para subir archivos una forma de que no falle es usando un formdata*/
    import {
        appStatus,
        setAppStatusLoading,
        setAppStatusError,
        setAppStatusChatMode,
    } from "../store.ts";
    import Dropzone from "svelte-file-dropzone";

    let files = {
        accepted: [],
        rejected: [],
    };

    async function handleFilesSelect(e) {
        const { acceptedFiles, fileRejections } = e.detail;

        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
        if (acceptedFiles.length > 0) {
            setAppStatusLoading();
            
            const formData = new FormData();
            formData.append("file", acceptedFiles[0]);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            
            if (!response.ok) {
                setAppStatusError();
                return;
            }

            const {id, url, pages} = await response.json();
            setAppStatusChatMode({id, url, pages});
        }
    }
</script>

{#if files.accepted.length === 0}
    <Dropzone
        accept="application/pdf"
        multiple={false}
        on:drop={handleFilesSelect}
    >
        Arrastra y suelta tus archivos aquí
    </Dropzone>
{/if}

<ol>
    {#each files.accepted as item}
        <li>{item.name}</li>
    {/each}
</ol>
