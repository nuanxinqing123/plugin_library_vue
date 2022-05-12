<template>
<!--    头部-->
    <HeaderCom />
<!--    Body-->
    <BodyCom />
<!--    底部-->
    <FooterCom />
</template>

<script>
import HeaderCom from "@/components/components/HeaderCom";
import BodyCom from "@/components/components/BodyCom";
import FooterCom from "@/components/components/FooterCom";

export default {
  name: 'HelloWorld',
    components: {
        HeaderCom,
        BodyCom,
        FooterCom
    }
}
</script>

<style scoped>

</style>
