import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./ingredients-tabs.module.scss";
import { IngredientsTabsProps } from "../../../utils/types";

function IngredientsTabs(props: IngredientsTabsProps) {
  const { currentTab, onTabClick } = props;

  return (
    <div className={styles.tabs}>
      <Tab value="bun" active={currentTab === "bun"} onClick={onTabClick}>
        Булки
      </Tab>
      <Tab value="sauce" active={currentTab === "sauce"} onClick={onTabClick}>
        Соусы
      </Tab>
      <Tab value="main" active={currentTab === "main"} onClick={onTabClick}>
        Начинки
      </Tab>
    </div>
  );
}

export default IngredientsTabs;
