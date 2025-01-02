// import ProjectCard from "components/ProjectCard";
// import ProjectOrderList from "components/ProjectOrderList";
// import ProjectSearchBar from "components/ProjectSearchBar";
import ProjectSiteAddress from "components/ProjectSiteAddress";
import UnitDetail from "components/UnitDetail";
import { LocalizeContext } from "i18n";
// import InstallMethodSelectDialog from "components/InstallMethodSelectDialog";
import PrimaryLayout from "layouts/PrimaryLayout";
import React from "react";
import { connect } from "react-redux";

const ProjectDetailPage = ({ data, projectNumber }) => {
  // const [searchCriteria, setSearchCriteria] = useState(null);
  // const [installationMethod, setInstallationMethod] = useState(null);
  const i18n = React.useContext(LocalizeContext);

  const fields = [
    {
      label: i18n.PROJECTLIST_PROJECT_NO,
      name: "projectNumber",
    },
    {
      label: i18n.PROJECTLIST_PROJECT_DESCRIPTION,
      name: "projectName",
    },
    {
      label: i18n.PROJECTLIST_SITE_ADDRESS,
      name: "projectSite",
      component: () => <ProjectSiteAddress projectNumber={projectNumber} />,
    },
    {
      label: i18n.JOBLIST_SUBCON_TL,
      name: "teamLeader",
    },
    {
      label: i18n.INSTAPP_PROJECTLIST_UnitCount,
      name: "orderQuantity",
    },
    {
      label: i18n.INSTAPP_PROJECTLIST_FitterCount,
      name: "fitterQuantity",
      muito: `/fitters/${projectNumber}`,
    },
    // {
    //   label: i18n.ISNTAPP_PROJECTLIST_PROJECT_PROGRESS,
    //   to: `/projectprogress/${projectNumber}`,
    // },
    // {
    //   label: i18n.ISNTAPP_PROJECTLIST_PROJECT_INSTALLATIONSTEPS,
    //   to: `/projectInstallationSteps/${projectNumber}`,
    // },
    {
      label: i18n.ISNTAPP_PROJECTLIST_PROJECT_PROGRESS,
      to: `/projectProgressPage/${projectNumber}`,
      description: "ACTIVITY",
    },
    {
      label: i18n.ISNTAPP_PROJECTLIST_PROJECT_INSTALLATIONSTEPS,
      to: `/projectInstallationSteps/${projectNumber}`,
      description: "STEPS",
    },
  ];

  // const handleClick = (method) => {
  //   setInstallationMethod(method);
  // };

  return (
    <PrimaryLayout title={i18n.PROJECTLIST_DETAILS}>
      <UnitDetail fields={fields} data={data} />
      {/* <ProjectSearchBar
        submit={(value) => {
          setSearchCriteria(value);
        }}
      />
      <ProjectCard projectNumber={projectNumber} link="/subconTeam/" />
      <InstallMethodSelectDialog handleClick={handleClick} />
      <ProjectOrderList
        installationMethod={installationMethod}
        searchCriteria={searchCriteria}
      /> */}
    </PrimaryLayout>
  );
};

const mapStateToProps = (
  { fittersAssignmentTransfer, orders, projects, partners },
  ownProps
) => {
  const { projectNumber } = ownProps.match.params;
  const { description: projectName } = projects[projectNumber] || {}; //teamLeader

  const OrderNos = Object.keys(orders).filter(
    (item) => orders[item].projectNumber === projectNumber
  );
  const teamLeader = OrderNos.map((item) => {
    return partners[`${item}-VW`]?.name1;
  });

  return {
    projectNumber: projectNumber,
    data: {
      projectNumber,
      fitterQuantity: fittersAssignmentTransfer[projectNumber]?.length,
      orderQuantity: Object.keys(orders).filter((key) => {
        return orders[key].projectNumber === projectNumber;
      }).length,
      projectName,
      teamLeader: [...new Set(teamLeader)].join("/"),
    },
  };
};

export default connect(mapStateToProps)(ProjectDetailPage);
