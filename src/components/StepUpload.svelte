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
            
            try {
                const formData = new FormData();
                formData.append("file", acceptedFiles[0]);

                console.log('Uploading file:', acceptedFiles[0].name);
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Upload error:', errorData.error);
                    setAppStatusError();
                    return;
                }

                const {id, url, pages} = await response.json();
                console.log('Upload successful:', {id, url, pages});
                setAppStatusChatMode({id, url, pages});
                
            } catch (error) {
                console.error('Error during upload:', error);
                setAppStatusError();
            }
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
