<script>
    import { Spinner } from "flowbite-svelte";
</script>
<div class="flex flex-col justify-center items-center gap-6">
    <div class="relative">
        <Spinner size="xl" class="text-blue-400" />
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
    </div>
    <div class="text-center space-y-2">
        <p class="text-2xl font-medium text-white">
            Procesando tu PDF...
        </p>
        <p class="text-sm text-gray-400 max-w-md">
            Subiendo a Cloudinary y extrayendo texto del documento
        </p>
        <div class="flex justify-center space-x-1 mt-4">
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
    </div>
</div>