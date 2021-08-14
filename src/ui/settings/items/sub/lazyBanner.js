const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const image = entry.target;

      image._lazyLoad();

      observer.unobserve(image);
    }
  }
});

export default () => {
const { React, ReactDOM } = goosemod.webpackModules.common;


return class LazyBanner extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);

    node._lazyLoad = () => {
      this.setState({
        loaded: true
      });
    };
    
    observer.observe(node);
  }

  render() {
    return React.createElement('div', {
      style: {
        backgroundImage: this.state.loaded ? `url("${this.props.src}")` : ''
      },

      onClick: this.props.onclick
    });
  }
};
};