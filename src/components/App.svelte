<script>
    import { Alert } from "flowbite-svelte";
    import { APP_STATUS, appStatus } from "../store.ts";
    import StepUpload from "./StepUpload.svelte";
    import StepLoading from "./StepLoading.svelte";
    import StepChat from "./StepChat.svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
    <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
    <StepLoading />
{:else if $appStatus === APP_STATUS.ERROR}
    <div class="flex justify-center">
        <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md text-center">
            <div class="text-4xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold text-white mb-2">Algo salió mal</h3>
            <p class="text-gray-300 mb-4">Hubo un error al procesar tu archivo</p>
            <button 
                on:click={() => appStatus.set(APP_STATUS.INIT)}
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                Intentar de nuevo
            </button>
        </div>
    </div>
{:else if $appStatus === APP_STATUS.CHAT_MODE}
    <StepChat />
{:else}
    <div class="flex justify-center">
        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 max-w-md text-center">
            <div class="text-4xl mb-4">❓</div>
            <h3 class="text-xl font-bold text-white mb-2">Estado no reconocido</h3>
            <p class="text-gray-300 mb-4">Este estado de la aplicación no es válido</p>
            <button 
                on:click={() => appStatus.set(APP_STATUS.INIT)}
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                Reiniciar
            </button>
        </div>
    </div>
{/if}
