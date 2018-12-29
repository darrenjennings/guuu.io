<template>
  <SWUpdatePopup>
    <div
      slot-scope="{ enabled, reload, message, buttonText }"
      class="my-sw-update-popup" v-if="enabled">
      {{ message }}<br>
      <button class="action ripple" @click="reload">{{ buttonText }}</button>
    </div>
  </SWUpdatePopup>
</template>

<script>
import SWUpdatePopup from '@vuepress/plugin-pwa/lib/SWUpdatePopup.vue'

export default {
  components: { SWUpdatePopup }
}
</script>

<style>
.my-sw-update-popup {
  text-align: right;
  position: fixed;
  z-index: 10;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 5px;
  background: hsl(0, 0%, 95%);
}

.my-sw-update-popup button {
  border: 1px solid #fefefe;
  font-size: 1rem;
  margin: 1rem 0 0 1rem;
  cursor: pointer;
}
</style>
