<script lang="ts">
	import type { Sampler } from "tone";
	import Samples from "./Samples";

	const octaves = [4, 5, 6];
	const notes = ["C", "D", "E", "F", "G", "A", "B"];

	const samples = new Samples();

	let instrument: Sampler | undefined;
	samples.instrument("cello").then((sampler) => {
		console.log("loaded");
		instrument = sampler;
		instrument.toDestination();
	});

	function start(note: string, octave: number, sharp?: boolean) {
		return (event: MouseEvent) => {
			console.log(`${note}${sharp ? "#" : ""}${octave}`);
			instrument.triggerAttack([`${note}${sharp ? "#" : ""}${octave}`]);
			event.stopPropagation();
		};
	}

	function stop(note: string, octave: number, sharp?: boolean) {
		return (event: MouseEvent) => {
			instrument.triggerRelease([`${note}${sharp ? "#" : ""}${octave}`]);
			event.stopPropagation();
		};
	}
</script>

<main>
	<div class="keyboard">
		{#each octaves as octave}
			{#each notes as note}
				{#if note !== "E" && note !== "B"}
					<button
						on:mousedown={start(note, octave, true)}
						on:mouseup={stop(note, octave, true)}
						class="blackkey"
					/>
				{/if}
				<button
					on:mousedown={start(note, octave)}
					on:mouseup={stop(note, octave)}
					class="whitekey"
				/>
			{/each}
		{/each}
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
	}

	.keyboard {
		position: relative;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		height: 200px;
		width: 100%;
	}

	.whitekey {
		position: relative;
		height: 100%;
		width: 50px;
		background: "white";
		float: left;
		border-top: 1px solid black;
		border-right: 1px solid black;
	}

	.whitekey:first-child {
		border-left: 1px solid black;
	}

	.blackkey {
		position: relative;
		height: 65%;
		width: 55%;
		z-index: 1;
		background: #444;
		left: 68%;
	}
</style>
