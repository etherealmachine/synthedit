<script lang="ts">
	import type { Sampler } from "tone";
	import Samples from "./Samples";

	const octaves = [4, 5, 6];
	const tones = ["C", "D", "E", "F", "G", "A", "B"];
	const keyBindings = ["zxcvbnm", "asdfghj", "qwertyu"];
	const notesPlaying: { [key: string]: Date } = {};

	const samples = new Samples();

	let instrument: Sampler | undefined;
	samples.instrument("piano").then((sampler) => {
		instrument = sampler;
		instrument.toDestination();
	});

	function note(tone: string, octave: number, sharp?: boolean): string {
		return `${tone}${
			tone !== "E" && tone !== "B" && sharp ? "#" : ""
		}${octave}`;
	}

	function onKeyDown(event: KeyboardEvent) {
		keyBindings.forEach((binding, octaveOffset) => {
			const i = binding.indexOf(event.key.toLowerCase());
			if (i >= 0) {
				const tone = tones[i];
				const octave = octaves[0] + octaveOffset;
				const n = note(tone, octave, event.shiftKey);
				if (notesPlaying[n]) return;
				notesPlaying[n] = new Date();
				instrument.triggerAttack([n]);
			}
		});
	}

	function onKeyUp(event: KeyboardEvent) {
		keyBindings.forEach((binding, octaveOffset) => {
			const i = binding.indexOf(event.key.toLowerCase());
			if (i >= 0) {
				const tone = tones[i];
				const octave = octaves[0] + octaveOffset;
				const n = note(tone, octave, event.shiftKey);
				notesPlaying[n] = undefined;
				instrument.triggerRelease([n]);
			}
		});
	}

	function start(note: string) {
		return (event: MouseEvent) => {
			instrument.triggerAttack([note]);
			event.stopPropagation();
		};
	}

	function stop(note: string) {
		return (event: MouseEvent) => {
			instrument.triggerRelease([note]);
			event.stopPropagation();
		};
	}
</script>

<main>
	<div class="keyboard" on:keydown={onKeyDown} on:keyup={onKeyUp}>
		{#each octaves as octave}
			{#each tones as tone}
				<div class="key">
					{#if tone !== "E" && tone !== "B"}
						<button
							on:mousedown={start(note(tone, octave, true))}
							on:mouseup={stop(note(tone, octave, true))}
							class="blackkey"
						/>
					{/if}
					<button
						on:mousedown={start(note(tone, octave))}
						on:mouseup={stop(note(tone, octave))}
						class="whitekey"
					/>
				</div>
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
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		height: 200px;
	}

	.key {
		position: relative;
	}

	.whitekey {
		height: 100%;
		min-width: 50px;
		background: "white";
		border: 1px solid black;
	}

	.blackkey {
		position: absolute;
		height: 65%;
		min-width: 30px;
		z-index: 1;
		background: #444;
		left: 35px;
		top: 0px;
	}
</style>
