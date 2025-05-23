import ActionButtons from "@/components/datatables/cellRendererFrameworks/ActionButtons.vue";
import Button from "@/components/datatables/cellRendererFrameworks/Button.vue";
import Link from "@/components/datatables/cellRendererFrameworks/Link.vue";

export function useCellRendererFrameworks(): Record<string, any> {
  return { ActionButtons, Button, Link };
}
