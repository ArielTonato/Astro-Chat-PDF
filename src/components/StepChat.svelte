<script>
    import { Label, Spinner } from "flowbite-svelte";
    import { appStatusInfo, setAppStatusError } from "../store";
    const { url, pages, id } = $appStatusInfo;

    let loading = false;
    let answer = "";

    console.log(url, pages, id);
    const numbOfImagesToShow = Math.min(pages, 4);
    const images = Array.from({ length: numbOfImagesToShow }, (_, i) => {
        const page = i + 1;
        return url
            .replace("upload", `upload/w_400,h_540,c_fill,pg_${page}/`)
            .replace(".pdf", ".jpg");
    });

    //w_400,h_540,c_fill,pg_2/
    const handleSubmit = async (event) => {
        event.preventDefault();

        loading = true;

        const question = event.target.question.value;

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    question,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error al enviar la pregunta:", errorData.error);
                answer = `Error: ${errorData.error || "Error desconocido"}`;
                return;
            }

            const { answer: apiAnswer } = await res.json();
            answer = apiAnswer;
        } catch (e) {
            console.error("Error en la petición:", e);
            answer = "Error de conexión. Intenta de nuevo.";
        } finally {
            loading = false;
        }
    };
</script>

<div class="space-y-8">
    <!-- PDF Preview -->
    <div class="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6">
        <h3 class="text-lg font-medium text-white mb-4">
            Vista previa del PDF
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            {#each images as image, index}
                <div class="relative group">
                    <img
                        src={image}
                        alt="PDF Page {index + 1}"
                        class="rounded-lg w-full h-auto aspect-[400/500] object-cover shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <div
                        class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
                    >
                        Página {index + 1}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Chat Form -->
    <div class="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6">
        <form on:submit={handleSubmit} class="space-y-4">
            <div>
                <Label for="question" class="block mb-2 text-white font-medium">
                    ¿Qué quieres saber sobre este documento?
                </Label>
                <input
                    id="question"
                    name="question"
                    required
                    placeholder="Ej: ¿De qué trata este documento? ¿Cuáles son los puntos principales?"
                    class="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autocomplete="off"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {#if loading}
                    <Spinner class="w-5 h-5 text-white" />
                    <span>Procesando...</span>
                {:else}
                    <span>Enviar Pregunta</span>
                {/if}
            </button>
        </form>
    </div>

    <!-- Answer -->
    {#if answer}
        <div class="bg-gray-900/30 backdrop-blur-sm rounded-lg p-6">
            <h3 class="text-xl font-bold text-white mb-4">Respuesta</h3>
            <div class="prose prose-invert max-w-none">
                <p class="text-gray-200 leading-relaxed">{answer}</p>
            </div>
        </div>
    {/if}
</div>
