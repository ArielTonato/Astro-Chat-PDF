<script>
    import { Spinner } from "flowbite-svelte";
</script>
<div class="flex flex-col justify-center items-center gap-5">
    <Spinner size="lg" />
    <div class="text-center">
        <p class="text-xl opacity-90 mb-2">
            Procesando tu PDF...
        </p>
        <p class="text-sm opacity-70">
            Subiendo a Cloudinary y extrayendo texto
        </p>
    </div>
</div>