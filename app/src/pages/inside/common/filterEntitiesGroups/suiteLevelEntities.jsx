import { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import { validate } from 'common/utils';
import {
  STATS_TOTAL,
  STATS_FAILED,
  STATS_PASSED,
  STATS_SKIPPED,
} from 'common/constants/statistics';
import {
  PRODUCT_BUG,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
  TO_INVESTIGATE,
} from 'common/constants/defectTypes';
import {
  EntityItemName,
  EntityItemDescription,
  EntityItemStartTime,
  EntityItemTags,
  EntityItemStatistics,
} from 'components/filterEntities';
import { EntitiesGroup } from 'components/filterEntities/entitiesGroup';
import {
  CONDITION_CNT,
  CONDITION_GREATER_EQ,
  CONDITION_BETWEEN,
  CONDITION_HAS,
  ENTITY_NAME,
  ENTITY_START_TIME,
  ENTITY_DESCRIPTION,
  ENTITY_TAGS,
} from 'components/filterEntities/constants';
import { defectTypesSelector } from 'controllers/project';

const messages = defineMessages({
  NameTitle: {
    id: 'SuiteLevelEntities.NameTitle',
    defaultMessage: 'Suite name',
  },
  DescriptionTitle: {
    id: 'SuiteLevelEntities.DescriptionTitle',
    defaultMessage: 'Description',
  },
  StartTimeTitle: {
    id: 'SuiteLevelEntities.StartTimeTitle',
    defaultMessage: 'Start time',
  },
  TagsTitle: {
    id: 'SuiteLevelEntities.TagsTitle',
    defaultMessage: 'Tags',
  },
  TotalTitle: {
    id: 'SuiteLevelEntities.TotalTitle',
    defaultMessage: 'Total',
  },
  PassedTitle: {
    id: 'SuiteLevelEntities.PassedTitle',
    defaultMessage: 'Passed',
  },
  FailedTitle: {
    id: 'SuiteLevelEntities.FailedTitle',
    defaultMessage: 'Failed',
  },
  SkippedTitle: {
    id: 'SuiteLevelEntities.SkippedTitle',
    defaultMessage: 'Skipped',
  },
  PRODUCT_BUG_title: {
    id: 'SuiteLevelEntities.PRODUCT_BUG_title',
    defaultMessage: 'Product bug',
  },
  PRODUCT_BUG_totalTitle: {
    id: 'SuiteLevelEntities.PRODUCT_BUG_totalTitle',
    defaultMessage: 'Total product bugs',
  },
  AUTOMATION_BUG_title: {
    id: 'SuiteLevelEntities.AUTOMATION_BUG_title',
    defaultMessage: 'Automation bug',
  },
  AUTOMATION_BUG_totalTitle: {
    id: 'SuiteLevelEntities.AUTOMATION_BUG_totalTitle',
    defaultMessage: 'Total automation bugs',
  },
  SYSTEM_ISSUE_title: {
    id: 'SuiteLevelEntities.SYSTEM_ISSUE_title',
    defaultMessage: 'System issue',
  },
  SYSTEM_ISSUE_totalTitle: {
    id: 'SuiteLevelEntities.SYSTEM_ISSUE_totalTitle',
    defaultMessage: 'Total system issues',
  },
  TO_INVESTIGATE_title: {
    id: 'SuiteLevelEntities.TO_INVESTIGATE_title',
    defaultMessage: 'To investigate',
  },
});

const DEFECT_TYPES_SEQUENCE = [
  PRODUCT_BUG.toUpperCase(),
  AUTOMATION_BUG.toUpperCase(),
  SYSTEM_ISSUE.toUpperCase(),
  TO_INVESTIGATE.toUpperCase(),
];
const DEFECT_ENTITY_ID_BASE = 'statistics$defects$';

@injectIntl
@connect((state) => ({
  defectTypes: defectTypesSelector(state),
}))
export class SuiteLevelEntities extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    defectTypes: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    entities: PropTypes.object,
  };
  static defaultProps = {
    onChange: () => {},
    entities: {},
  };
  getStaticEntities = () => {
    const { intl, entities } = this.props;
    return [
      {
        id: ENTITY_NAME,
        component: EntityItemName,
        value: entities[ENTITY_NAME] || {
          value: '',
          condition: CONDITION_CNT,
        },
        validationFunc: (entityObject) =>
          (!entityObject || !entityObject.value || !validate.itemNameEntity(entityObject.value)) &&
          'itemNameEntityHint',
        title: intl.formatMessage(messages.NameTitle),
        active: true,
        removable: false,
        static: true,
      },
      {
        id: ENTITY_START_TIME,
        component: EntityItemStartTime,
        value: entities[ENTITY_START_TIME] || {
          value: `${moment()
            .startOf('day')
            .subtract(1, 'months')
            .valueOf()},${moment()
            .endOf('day')
            .valueOf() + 1}`,
          condition: CONDITION_BETWEEN,
        },
        title: intl.formatMessage(messages.StartTimeTitle),
        active: ENTITY_START_TIME in entities,
        removable: true,
      },
      {
        id: ENTITY_DESCRIPTION,
        component: EntityItemDescription,
        value: entities[ENTITY_DESCRIPTION] || {
          value: '',
          condition: CONDITION_CNT,
        },
        title: intl.formatMessage(messages.DescriptionTitle),
        validationFunc: (entityObject) =>
          (!entityObject ||
            !entityObject.value ||
            !validate.launchDescriptionEntity(entityObject.value)) &&
          'launchDescriptionEntityHint',
        active: ENTITY_DESCRIPTION in entities,
        removable: true,
      },
      {
        id: ENTITY_TAGS,
        component: EntityItemTags,
        value: entities[ENTITY_TAGS] || {
          value: '',
          condition: CONDITION_HAS,
        },
        title: intl.formatMessage(messages.TagsTitle),
        active: ENTITY_TAGS in entities,
        removable: true,
      },
      {
        id: STATS_TOTAL,
        component: EntityItemStatistics,
        value: entities[STATS_TOTAL] || {
          value: '',
          condition: CONDITION_GREATER_EQ,
        },
        validationFunc: (entityObject) =>
          (!entityObject ||
            !entityObject.value ||
            !validate.launchNumericEntity(entityObject.value)) &&
          'launchNumericEntityHint',
        title: intl.formatMessage(messages.TotalTitle),
        active: STATS_TOTAL in entities,
        removable: true,
      },
      {
        id: STATS_PASSED,
        component: EntityItemStatistics,
        value: entities[STATS_PASSED] || {
          value: '',
          condition: CONDITION_GREATER_EQ,
        },
        validationFunc: (entityObject) =>
          (!entityObject ||
            !entityObject.value ||
            !validate.launchNumericEntity(entityObject.value)) &&
          'launchNumericEntityHint',
        title: intl.formatMessage(messages.PassedTitle),
        active: STATS_PASSED in entities,
        removable: true,
      },
      {
        id: STATS_FAILED,
        component: EntityItemStatistics,
        value: entities[STATS_FAILED] || {
          value: '',
          condition: CONDITION_GREATER_EQ,
        },
        validationFunc: (entityObject) =>
          (!entityObject ||
            !entityObject.value ||
            !validate.launchNumericEntity(entityObject.value)) &&
          'launchNumericEntityHint',
        title: intl.formatMessage(messages.FailedTitle),
        active: STATS_FAILED in entities,
        removable: true,
      },
      {
        id: STATS_SKIPPED,
        component: EntityItemStatistics,
        value: entities[STATS_SKIPPED] || {
          value: '',
          condition: CONDITION_GREATER_EQ,
        },
        validationFunc: (entityObject) =>
          (!entityObject ||
            !entityObject.value ||
            !validate.launchNumericEntity(entityObject.value)) &&
          'launchNumericEntityHint',
        title: intl.formatMessage(messages.SkippedTitle),
        active: STATS_SKIPPED in entities,
        removable: true,
      },
    ];
  };

  getDynamicEntities = () => {
    const { intl, entities } = this.props;
    let defectTypeEntities = [];
    DEFECT_TYPES_SEQUENCE.forEach((defectTypeRef) => {
      const defectTypeGroup = this.props.defectTypes[defectTypeRef];
      const hasSubtypes = defectTypeGroup.length > 1;

      defectTypeEntities.push({
        id: `${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total`,
        component: EntityItemStatistics,
        value: entities[`${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total`] || {
          value: '',
          condition: CONDITION_GREATER_EQ,
        },
        validationFunc: (entityObject) =>
          (!entityObject ||
            !entityObject.value ||
            !validate.launchNumericEntity(entityObject.value)) &&
          'launchNumericEntityHint',
        title: intl.formatMessage(
          messages[`${defectTypeRef}_${hasSubtypes ? 'totalTitle' : 'title'}`],
        ),
        active: `${DEFECT_ENTITY_ID_BASE}${defectTypeRef.toLowerCase()}$total` in entities,
        removable: true,
      });
      if (hasSubtypes) {
        defectTypeEntities = defectTypeEntities.concat(
          defectTypeGroup.map((defectType) => ({
            id: `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${defectType.locator}`,
            component: EntityItemStatistics,
            value: entities[
              `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${defectType.locator}`
            ] || {
              value: '',
              condition: CONDITION_GREATER_EQ,
            },
            validationFunc: (entityObject) =>
              (!entityObject ||
                !entityObject.value ||
                !validate.launchNumericEntity(entityObject.value)) &&
              'launchNumericEntityHint',
            title: `${intl.formatMessage(messages[`${defectTypeRef}_title`])} ${
              defectType.shortName
            }`,
            active:
              `${DEFECT_ENTITY_ID_BASE}${defectType.typeRef.toLowerCase()}$${defectType.locator}` in
              entities,
            removable: true,
            meta: {
              longName: defectType.longName,
              subItem: true,
            },
          })),
        );
      }
    });
    return defectTypeEntities;
  };

  render() {
    return (
      <EntitiesGroup
        entitiesSet={this.getStaticEntities().concat(this.getDynamicEntities())}
        onChangeOwn={this.props.onChange}
      />
    );
  }
}
