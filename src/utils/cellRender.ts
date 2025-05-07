export const CellRender = defineComponent({
  props: {
    render: {
      type: [Function, Object, String, Number, Date],
      required: true,
    },
    props: {
      type: Object,
      default: () => ({}),
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  setup: (props) => {
    return () => {
      const mergedProps = { ...props.props, ...props.params };

      if (typeof props.render === "function") {
        return props.render(mergedProps);
      } else if (typeof props.render === "object" && props.render !== null) {
        return h(props.render, mergedProps);
      }

      return props.render;
    };
  },
});
