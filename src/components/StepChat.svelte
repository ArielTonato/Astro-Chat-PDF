<script>
    import { Input, Label, Spinner } from "flowbite-svelte";
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
                answer = `Error: ${errorData.error || 'Error desconocido'}`;
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

<div class="grid grid-cols-4 gap-2">
    {#each images as image}
        <img
            src={image}
            alt="PDF Page"
            class="rounded w-full h-auto aspect-[400/500]"
        />
    {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
    <Label for="question" class="block mb-2">Deja aqui tu pregunta</Label>
    <Input id="question" required placeholder="¿De que trata este documento?"
    ></Input>
</form>

{#if loading}
    <div class="flex justify-center items-center flex-col gap-y-2">
        <Spinner class="w-8 h-8"></Spinner>
        <p>Esperando Respuesta</p>
    </div>
{/if}

{#if answer}
    <div class="mt-8">
        <p class="text-xl font-bold">Respuesta</p>
        <p>{answer}</p>
    </div>
{/if}
