import React from "react";
import {waitForElementToBeRemoved, wait} from "@testing-library/react";
import render from "../../../helpers/testHelper";
import baseProps from "../../../stories/helpers/baseProps.js";
import Core, {CRM_FIGHTER_CORE_QUERY, CRM_FIGHTER_CORE_SUB} from "./core.js";

it("should render", async () => {
  const {container, getByText} = render(<Core {...baseProps} />, {
    queries: [CRM_FIGHTER_CORE_QUERY, CRM_FIGHTER_CORE_SUB],
  });
  await waitForElementToBeRemoved(() => getByText("Loading..."));
  await wait();
  expect(container.innerHTML).toBeTruthy();
  expect(container.innerHTML).not.toBe("Error");
});
