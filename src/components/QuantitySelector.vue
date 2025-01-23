<template>
  <div class="input-group">
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="decrease"
      :disabled="modelValue <= 1"
    >
      <i class="bi bi-dash"></i>
    </button>
    <input
      type="number"
      class="form-control text-center"
      :value="modelValue"
      @input="updateValue($event.target.value)"
      min="1"
      :max="max"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="increase"
      :disabled="modelValue >= max"
    >
      <i class="bi bi-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'QuantitySelector',
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 99,
    },
  },
  methods: {
    updateValue(value) {
      const newValue = Math.min(Math.max(Number(value) || 1, 1), this.max)
      this.$emit('update:modelValue', newValue)
    },
    increase() {
      if (this.modelValue < this.max) {
        this.updateValue(this.modelValue + 1)
      }
    },
    decrease() {
      if (this.modelValue > 1) {
        this.updateValue(this.modelValue - 1)
      }
    },
  },
}
</script>
