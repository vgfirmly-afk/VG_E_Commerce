<script>
	import { goto } from '$app/navigation';

	export let product;

	function handleClick() {
		if (product.product_id) {
			goto(`/products/${product.product_id}`);
		}
	}

	$: imageUrl = product.images && product.images.length > 0 
		? product.images[0] 
		: 'https://via.placeholder.com/300x300?text=No+Image';
</script>

<div
	class="card group cursor-pointer transform hover:scale-105 transition-all duration-300"
	on:click={handleClick}
	role="button"
	tabindex="0"
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
>
	<div class="aspect-square bg-gray-100 overflow-hidden">
		<img
			src={imageUrl}
			alt={product.title || 'Product image'}
			class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
			loading="lazy"
		/>
	</div>
	<div class="p-4">
		<h3 class="font-semibold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
			{product.title || 'Untitled Product'}
		</h3>
		<p class="text-gray-600 text-sm line-clamp-2 mb-3">
			{product.description || product.short_description || ''}
		</p>
		{#if product.categories && product.categories.length > 0}
			<span class="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
				{product.categories[0]}
			</span>
		{/if}
	</div>
</div>
