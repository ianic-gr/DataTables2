// vue-shims.d.ts or shims-vue.d.ts
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<object, object, any>;
  export default component;
}
