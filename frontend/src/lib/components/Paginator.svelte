<script>
	export let pagination = null;
	export let onPageChange = () => {};
	export let showInfo = true;
	export let showPageInput = true;
	export let showStepButtons = true;
	export let className = "";

	let pageInput = "";
	let inputError = false;

	$: if (pagination) {
		pageInput = pagination.currentPage?.toString() || "1";
	}
	
	// Ensure pagination has all required fields
	$: isValidPagination = pagination && 
		pagination.totalPages !== undefined && 
		pagination.currentPage !== undefined &&
		pagination.total !== undefined;
	
	// Force reactivity by tracking pagination changes
	$: if (pagination) {
		// This reactive statement ensures the component updates when pagination changes
		pageInput = pagination.currentPage?.toString() || "1";
	}

	function handlePrevious() {
		if (pagination && pagination.hasPrevious && pagination.previousPage) {
			onPageChange(pagination.previousPage);
		}
	}

	function handleNext() {
		if (pagination && pagination.hasNext && pagination.nextPage) {
			onPageChange(pagination.nextPage);
		}
	}

	function handlePageInput(event) {
		const value = event.target.value.trim();
		if (!value) {
			pageInput = "";
			inputError = false;
			return;
		}

		const pageNum = parseInt(value, 10);
		if (isNaN(pageNum) || pageNum < 1 || pageNum > pagination.totalPages) {
			inputError = true;
			return;
		}

		inputError = false;
		onPageChange(pageNum);
	}

	function handleKeyPress(event) {
		if (event.key === "Enter") {
			handlePageInput(event);
		}
	}

	function handleBlur(event) {
		if (inputError || !pageInput) {
			// Reset to current page if invalid or empty
			pageInput = pagination?.currentPage?.toString() || "1";
			inputError = false;
		}
	}
</script>

{#if isValidPagination}
	<div class="flex flex-col items-center gap-4 {className}">
		{#if showInfo}
			<div class="text-sm text-gray-600">
				Showing page <span class="font-semibold text-gray-800">{pagination.currentPage}</span> of{" "}
				<span class="font-semibold text-gray-800">{pagination.totalPages}</span>
				<span class="mx-2">•</span>
				<span class="font-semibold text-gray-800">{pagination.total}</span> total items
			</div>
		{/if}

		{#if pagination.totalPages > 1}
			<div class="flex items-center gap-2">
				{#if showStepButtons}
					<button
						on:click={handlePrevious}
						disabled={!pagination.hasPrevious}
						class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700 hover:text-gray-900 disabled:hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="Previous page"
					>
						← Previous
					</button>
				{/if}

				{#if showPageInput}
					<div class="flex items-center gap-2">
						<label for="page-input" class="text-sm text-gray-700 font-medium">Page:</label>
						<input
							id="page-input"
							type="text"
							bind:value={pageInput}
							on:keypress={handleKeyPress}
							on:blur={handleBlur}
							on:input={(e) => {
								pageInput = e.target.value;
								inputError = false;
							}}
							min="1"
							max={pagination.totalPages}
							class="w-20 px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 transition-all duration-200 {inputError
								? 'border-red-500 focus:ring-red-500 bg-red-50'
								: 'border-gray-300 focus:ring-blue-500'}"
							placeholder={pagination.currentPage.toString()}
						/>
						<span class="text-sm text-gray-600">of {pagination.totalPages}</span>
					</div>
				{/if}

				{#if showStepButtons}
					<button
						on:click={handleNext}
						disabled={!pagination.hasNext}
						class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700 hover:text-gray-900 disabled:hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="Next page"
					>
						Next →
					</button>
				{/if}
			</div>
		{/if}

		{#if inputError}
			<div class="text-sm text-red-600 mt-1">
				Please enter a valid page number between 1 and {pagination.totalPages}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Additional custom styles if needed */
</style>

