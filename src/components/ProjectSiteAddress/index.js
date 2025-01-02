import { connect } from "react-redux";
import * as publicFN from "js/publicFn";

const ProjectSiteAddress = ({ siteAddress }) => {
  return siteAddress;
};

const mapStateToProps = (state, ownProps) => {
  return {
    siteAddress: publicFN.getProjectSiteAddress(state, ownProps),
  };
};

export default connect(mapStateToProps)(ProjectSiteAddress);
