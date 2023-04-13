<template>
  <div class="container qrcode-generator" style="width: 500px; height: 500px">
    <qrcode-vue :value="value" :size="size" class="m-auto"></qrcode-vue>
    <br />
    <button v-on:click="upsize">Upsize</button>
    <br />
    <button v-on:click="random">Random</button>
  </div>
</template>

<script>
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";

export default {
  components: {
    QrcodeVue,
  },
  setup() {
    let value = ref("hr:defaultdata.random");
    let size = ref(100);

    function upsize() {
      size.value = size.value + 100;
    }

    function random() {
      const result = Math.random().toString(36);
      value.value = "hr://" + result;
    }

    return { value, size, upsize, random };
  },
};
</script>
