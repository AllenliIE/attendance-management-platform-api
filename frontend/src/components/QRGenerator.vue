<template>
  <div class="container qrcode-generator" style="width: 500px; height: 500px">
    <qrcode-vue
      :value="value"
      :size="size"
      class="m-auto"
      style="padding-top: 50px"
    ></qrcode-vue>
    <br />
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import QrcodeVue from "qrcode.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc, timezone);

export default {
  components: {
    QrcodeVue,
  },
  setup() {
    const store = useStore();
    const dateValue = localStorage.getItem("date");
    const date = ref(dateValue);
    let data = reactive({
      date: null,
    });

    let value = ref("hr:defaultdata.random");
    let size = ref(500);

    date.value = dayjs.utc().local().format("YYYY-MM-DD 08:00:00");
    localStorage.setItem("date", date.value);
    data = {
      UserId: store.getters.userId,
      date: date.value,
    };

    const encodedString = btoa(JSON.stringify(data));
    const urlEncodedString = encodeURIComponent(encodedString);
    value.value = urlEncodedString;
    return { value, size };
  },
};
</script>
