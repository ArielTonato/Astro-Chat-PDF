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
    <div class="flex justify-center">
        <Dropzone
            accept="application/pdf"
            multiple={false}
            on:drop={handleFilesSelect}
            class="w-full max-w-md h-48 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center p-6 hover:border-gray-300 transition-colors cursor-pointer bg-gray-900/50 backdrop-blur-sm"
        >
            <div class="space-y-4">
                <div class="text-6xl opacity-50">📄</div>
                <div class="text-xl font-medium text-white">Arrastra tu PDF aquí</div>
                <div class="text-sm text-gray-400">o haz clic para seleccionar</div>
            </div>
        </Dropzone>
    </div>
{:else}
    <div class="flex justify-center">
        <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 max-w-md">
            <div class="flex items-center space-x-3">
                <div class="text-2xl">✅</div>
                <div>
                    <div class="font-medium text-white">{files.accepted[0].name}</div>
                    <div class="text-sm text-gray-400">Archivo cargado correctamente</div>
                </div>
            </div>
        </div>
    </div>
{/if}
