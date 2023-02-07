import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import classnames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";

import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

// @mui
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";

import { Droppable } from "./components/Droppable"; 
import Filters from "./components/Filters";
import { SortableItem } from "./components/SortableItem";
import Carousel from "./components/date-carousel/Carousel";

// utils
import { insertAtIndex, removeAtIndex } from "./utilities/array";
import axios from "axios";

// css
import "./custom.scss";
import styles from "./scheduler.module.scss";

// graphics
import BarChartIcon from "./assets/icons/bar-chart.svg";
import BuildIcon from "./assets/icons/build.svg";
import ListIcon from "./assets/icons/list-alt.svg";
import PlusIcon from "./assets/icons/plus.svg";
import SortIcon from "./assets/icons/sort.svg";
import UserIcon from "./assets/icons/user.svg";

// weather icons
import PartlyCloudyIcon from "./assets/icons/weather/partly-cloudy.svg";
import RainIcon from "./assets/icons/weather/rain.svg";
import SnowIcon from "./assets/icons/weather/snow.svg";
import SunnyIcon from "./assets/icons/weather/sunny.svg";
import ThunderIcon from "./assets/icons/weather/thunder.svg";

// ----------------------------------------------------------------------

export default function SchedulerPage() {
  const boxWidth = 1.714;

  const [value, setValue] = useState(new Date());
  const [active, setActive] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [carouselData, setCarousel] = useState("week");
  const [addedNewShift, setAddedNewShift] = useState(false);
  const [allJsonData, setJsonData] = useState([]);
  const handleNewShift = () => {
    setAddedNewShift(true);
  };

  const [buttonClick, setButtonClick] = useState(false);

  const handleButtonClick = () => {
    setButtonClick(true);
  };

  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublished(true);
  };

  const [schedules, setSchedules] = useState([]);
  

  const [employeeSchedules, setEmployeeSchedules] = useState([]);
 

  useEffect(() => {
    try {
      axios.get("/data/row.json").then((response) => {
        setJsonData(response?.data);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handlePositon=(data)=>{
    const dates = new Set([...data?.map((val)=>val.date)]);
    const position = new Set([...data?.map((val)=>val.position)]);
    const positionList = [];
    Array.from(position).map((item)=>{
      return Array.from(dates)?.map((val)=>{
        const filteredEmployee = data?.filter(
          data => data.date === val && data.position === item
        );
        if(filteredEmployee?.length > 1){ 
          const allFilteredShifts = filteredEmployee?.reduce((prev,next)=>{
            if(Object.keys(prev)?.length){
              const key = JSON.parse(JSON.stringify(prev));
              const shifts = [...(key.shifts || []),...next.shifts];
              return {...prev, shifts};
            }else{
              return next;
            }
          },{});
          positionList.push(allFilteredShifts);
        }else if(filteredEmployee.length){
          positionList.push(filteredEmployee[0]);
        }
      })
    })
    setSchedules(positionList);
  }

  useEffect(()=>{
    try{
      axios.get("/data/shift-emp.json").then((response)=>{
        const {data} = response;
        handlePositon(data);
        setEmployeeSchedules(data);
        setFilterData(data);
      })
    }catch(error){
      console.error(error);
    }
  },[])

  const [weekDay, setWeekDay] = useState(0);
  const handleDateFilterWeek = (date) => {
    const newDate = date;
    const weekArr = [];
    for (let i = weekDay; i <= 6; i++) {
      const startOfWeek = moment(newDate).day(0);
      const filterNextDay = moment(startOfWeek)
        .add(i, "days")
        .format("MM/DD/YY");
      setWeekDay((value) =>{
        return value + 1;
      });
      weekArr.push(filterNextDay);
    }
    setWeekDay(0);
    const datesFilter = schedules.filter((value) => {
      return weekArr.includes(value.date);
    });
    setFilterData(datesFilter);
  };
  const [currentDay, setCurrentDay] = useState(value);
  const [beginningOfWeek, setBeginningOfWeek] = useState();
  const [endOfWeek, setEndOfWeek] = useState();

  const [day1Text, setDay1Text] = useState();
  const [day2Text, setDay2Text] = useState();
  const [day3Text, setDay3Text] = useState();
  const [day4Text, setDay4Text] = useState();
  const [day5Text, setDay5Text] = useState();
  const [day6Text, setDay6Text] = useState();
  const [day7Text, setDay7Text] = useState();

  const [todayText, setTodayText] = useState(value);
  useEffect(() => {
    try {
      const currentDay = moment(value).format("MM/DD/YYYY").toString();
      setCurrentDay(currentDay);

      const todayText = moment().format("ddd").toString(); 
      const todayMonthText = moment().format("MMM").toString();
      const todayDayNumber = moment().format("D").toString();
      const todayDayText =
        todayText + ", " + todayMonthText + " " + todayDayNumber;
      setTodayText(todayDayText);

      const from_date = moment(value)
        .startOf("week")
        .add(1, "days")
        .format("MM/DD/YYYY")
        .toString();
      const to_date = moment(value)
        .endOf("week")
        .add(1, "days")
        .format("MM/DD/YYYY")
        .toString();

      setBeginningOfWeek(from_date);
      setEndOfWeek(to_date);

      const currentDayText = moment(from_date).format("ddd").toString();
      const currentDayMonthText = moment(from_date).format("MMM").toString();
      const currentDayNumber = moment(from_date).format("D").toString();
      const day1Text =
        currentDayText + ", " + currentDayMonthText + " " + currentDayNumber;
      setDay1Text(day1Text);

      const currentDayText2 = moment(from_date)
        .add(1, "days")
        .format("ddd")
        .toString();
      const currentDayMonthText2 = moment(from_date)
        .add(1, "days")
        .format("MMM")
        .toString();
      const currentDayNumber2 = moment(from_date)
        .add(1, "days")
        .format("D")
        .toString();
      const day2Text =
        currentDayText2 + ", " + currentDayMonthText2 + " " + currentDayNumber2;
      setDay2Text(day2Text);

      const currentDayText3 = moment(from_date)
        .add(2, "days")
        .format("ddd")
        .toString();
      const currentDayMonthText3 = moment(from_date)
        .add(2, "days")
        .format("MMM")
        .toString();
      const currentDayNumber3 = moment(from_date)
        .add(2, "days")
        .format("D")
        .toString();
      const day3Text =
        currentDayText3 + ", " + currentDayMonthText3 + " " + currentDayNumber3;
      setDay3Text(day3Text);

      const currentDayText4 = moment(from_date)
        .add(3, "days")
        .format("ddd")
        .toString();
      const currentDayMonthText4 = moment(from_date)
        .add(3, "days")
        .format("MMM")
        .toString();
      const currentDayNumber4 = moment(from_date)
        .add(3, "days")
        .format("D")
        .toString();
      const day4Text =
        currentDayText4 + ", " + currentDayMonthText4 + " " + currentDayNumber4;
      setDay4Text(day4Text);

      const currentDayText5 = moment(from_date)
        .add(4, "days")
        .format("ddd")
        .toString();
      const currentDayMonthText5 = moment(from_date)
        .add(4, "days")
        .format("MMM")
        .toString();
      const currentDayNumber5 = moment(from_date)
        .add(4, "days")
        .format("D")
        .toString();
      const day5Text =
        currentDayText5 + ", " + currentDayMonthText5 + " " + currentDayNumber5;
      setDay5Text(day5Text);

      const currentDayText6 = moment(from_date)
        .add(5, "days")
        .format("ddd")
        .toString();
      const currentDayMonthText6 = moment(from_date)
        .add(5, "days")
        .format("MMM")
        .toString();
      const currentDayNumber6 = moment(from_date)
        .add(5, "days")
        .format("D")
        .toString();
      const day6Text =
        currentDayText6 + ", " + currentDayMonthText6 + " " + currentDayNumber6;
      setDay6Text(day6Text);

      const currentDayText7 = moment(from_date)
        .add(6, "days")
        .format("ddd")
        .toString();
      const currentDayMonthText7 = moment(from_date)
        .add(6, "days")
        .format("MMM")
        .toString();
      const currentDayNumber7 = moment(from_date)
        .add(6, "days")
        .format("D")
        .toString();
      const day7Text =
        currentDayText7 + ", " + currentDayMonthText7 + " " + currentDayNumber7;
      setDay7Text(day7Text);
    } catch (error) {
      console.error(error);
    }
  }, [value, weekDay]);

  const handleDateFilter = (date) => {
    const stringedDate = moment(date).format("MM/DD/YY").toString();
    const dateFilter = filterData.filter((value) => {
      const anything = value.date === stringedDate;

      return anything;
    });
    setFilterData(dateFilter);
  };

  const handleDateFilterMonth = (date) => {
    const monthArr = [];
    const startOfMonth = moment(date).startOf("month", date).format("MM/DD/YY");
    const loopEnd = moment(date).endOf("month", date).format("DD");
    for (let i = 0; i < +loopEnd; i++) {
      const dateIteration = moment(startOfMonth)
        .add(i, "days")
        .format("MM/DD/YY");
      monthArr.push(dateIteration);
    }
    const monthFilter = schedules.filter((value) => {
      return monthArr.includes(value.date);
    });
    setFilterData(monthFilter);
  };

  const [schedulerView, setSchedulerView] = useState("position");

  const handleSchedulerView = (value) => {
    setSchedulerView(value);
  };

  const [optionTools, setOptionTools] = useState("Tools");
  const handleChangeTools = (event) => {
    setOptionTools(event.target.value);
  };

  const [optionAdd, setOptionAdd] = useState("Add");
  const handleAdd = (event) => {
    setOptionAdd(event.target.value);
  };

  const [optionSort, setOptionSort] = useState("Sort");
  const handleSort = (event) => {
    setOptionSort(event.target.value);
  };

  function findContainer(id, type = "", list = schedules) {
    let result = null;

    if (id) {
      if (id in list) {
        return id;
      }
      if (type === "parent") {
        result = list.find((schedule) => schedule.id === id);
      } else if (type === "shift") {
        result = list.find((schedule) => {
          if (schedule.shifts && schedule.shifts.length > 0) {
            return schedule.shifts.find((sub) => {
              return sub.id === id;
            });
          }

          return result;
        });
      }
    }

    return result;
  }
  const findContainerView = (
    activeContainer,
    list = schedules,
    key = "name",
    value = ""
  ) => {
    let result = null;
    if (activeContainer) {
      result = list?.find((data) => {
        return (
          data?.date === activeContainer?.date &&
          data?.[`${key}`] === (schedule?.[`${key}`] || value)
        );
      });
    }
    return result;
  };

  function handleDragStart(event) {
    setActive(event.active.id);
    setSchedule(event.active.data.current);
  }
  const handleDragForPostion = (
    activeContainer,
    activeContainerEmp,
    over,
    overContainerEmp,
    overContainer,
    active
  ) => {
    const activeIndex = activeContainer.shifts.findIndex(
      (sub) => sub.id === active.id
    );
    const activeIndexEmp = activeContainerEmp?.shifts?.findIndex(
      (item) =>
        item?.position === activeContainer?.position &&
        item?.name === active?.data?.current?.item?.name
    );
    const overIndex = schedules.findIndex(
      (item) => item.id === over.id || item.id === overContainer?.id
    );
    const overIndexEmp = employeeSchedules?.findIndex((item) => {
      return item?.id === overContainerEmp?.id;
    });
    const activeContainerIndex = schedules.findIndex(
      (container) => container.id === activeContainer.id
    );
    const activeContainerIndexEmp = employeeSchedules.findIndex(
      (container) => container.id === activeContainerEmp.id
    );
    let newItems = moveBetweenContainers(
      schedules,
      activeContainer,
      activeIndex,
      overContainer,
      overIndex,
      active,
      activeContainerIndex,
      overIndex
    );
    setSchedules(Object.values(newItems));
    const data = activeContainerEmp?.shifts?.filter((item) => {
      return item?.name === active?.data?.current?.item?.name;
    })?.[0];
    let newItems1 = moveBetweenContainers(
      employeeSchedules,
      activeContainerEmp,
      activeIndexEmp,
      overContainerEmp,
      overIndexEmp,
      data,
      activeContainerIndexEmp,
      overIndexEmp,
      true
    );
    setEmployeeSchedules(Object.values(newItems1));
  };
  const handleDragForEmployees = (
    activeContainer,
    activeContainerPos,
    over,
    overContainerPos,
    overContainer,
    active
  ) => {
    const activeIndex = activeContainer.shifts.findIndex(
      (sub) => sub.id === active.id
    );
    const activeIndexPos = activeContainerPos?.shifts?.findIndex(
      (item) =>
        item?.position === activeContainer?.position &&
        item?.name === active?.data?.current?.item?.name
    );
    const overIndex = employeeSchedules.findIndex(
      (item) => item.id === over.id || item.id === overContainer.id
    );
    const overIndexPos = schedules?.findIndex((item) => {
      return item?.id === overContainerPos?.id;
    });
    const activeContainerIndex = employeeSchedules.findIndex(
      (container) => container.id === activeContainer.id
    );
    const activeContainerIndexPos = schedules.findIndex(
      (container) => container.id === activeContainerPos.id
    );

    const newItems = moveBetweenContainers(
      employeeSchedules,
      activeContainer,
      activeIndex,
      overContainer,
      overIndex,
      active,
      activeContainerIndex,
      overIndex
    );
    setEmployeeSchedules(Object.values(newItems));
    const data = activeContainerPos?.shifts?.filter((item) => {
      return item?.name === active?.data?.current?.item?.name;
    })?.[0];
    let newItems1 = moveBetweenContainers(
      schedules,
      activeContainerPos,
      activeIndexPos,
      overContainerPos,
      overIndexPos,
      data,
      activeContainerIndexPos,
      overIndexPos,
      true
    );
    setSchedules(Object.values(newItems1));
  };
  const handleDragCancel = () => {
    setActive(null);
    setSchedule(null);
  };
  // this is where we will add a function that updates shift time after drag
  function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const activeType = active.data.current.type;
    let overId = null;
    let overType = null;
    if (over) {
      overId = over.id;
      overType = over.data.current.type;
    }
    if (schedulerView === "position") {
      // Find the containers
      const activeContainer = findContainer(id, activeType, schedules);
      const overContainer = findContainer(overId, overType, schedules);
      const activeContainerEmp = findContainerView(
        activeContainer,
        employeeSchedules,
        "name"
      );
      const overContainerEmp = findContainerView(
        overContainer,
        employeeSchedules,
        "name"
      );

      if (
        !activeContainer ||
        !overContainer ||
        !activeContainerEmp ||
        !overContainerEmp
      ) {
        return;
      }
      if (overType === "parent") {
        if (active.id !== over.id) {
          if (activeType === "parent") {
            setSchedules((items) => {
              const oldIndex = items.findIndex((item) => item.id === active.id);
              const newIndex = items.findIndex((item) => item.id === over.id);

              return arrayMove(items, oldIndex, newIndex);
            });
          } else {
            // add Shift
            handleDragForPostion(
              activeContainer,
              activeContainerEmp,
              over,
              overContainerEmp,
              overContainer,
              active
            );
          }
        } else {
          return;
        }
      } else if (overType === "shift" && activeType === "shift") {
        if (active.id !== over.id) {
          if (activeContainer.id === overContainer.id) {
            const subList = activeContainer.shifts;
            const oldIndex = subList.findIndex((sub) => sub.id === active.id);
            const newIndex = subList.findIndex((sub) => sub.id === over.id);

            const updatedSubList = arrayMove(subList, oldIndex, newIndex);
            const updatedSchedules = schedules.map((schedule) => {
              if (schedule.id === activeContainer.id) {
                schedule.shifts = updatedSubList;
              }

              return schedule;
            });
            setSchedules(updatedSchedules);
          } else {
            handleDragForPostion(
              activeContainer,
              activeContainerEmp,
              over,
              overContainerEmp,
              overContainer,
              active
            );
          }
        }
      }
    } else {
      // Find the containers
      const activeContainer = findContainer(id, activeType, employeeSchedules);
      const overContainer = findContainer(overId, overType, employeeSchedules);

      const activeContainerPos = findContainerView(
        activeContainer,
        schedules,
        "position",
        schedule?.item?.position
      );
      const overContainerPos = findContainerView(
        overContainer,
        schedules,
        "position",
        schedule?.item?.position
      );
      if (
        !activeContainer ||
        !overContainer ||
        !activeContainerPos ||
        !overContainerPos
      ) {
        return;
      }

      if (overType === "parent") {
        if (active.id !== over.id) {
          if (activeType === "parent") {
            setEmployeeSchedules((items) => {
              const oldIndex = items.findIndex((item) => item.id === active.id);
              const newIndex = items.findIndex((item) => item.id === over.id);
              return arrayMove(items, oldIndex, newIndex)
            })
          } else {
            // add Shift
            handleDragForEmployees(
              activeContainer,
              activeContainerPos,
              over,
              overContainerPos,
              overContainer,
              active
            );
          }
        }
      } else if (overType === "shift" && activeType === "shift") {
        if (active.id !== over.id) {
          if (activeContainer.id === overContainer.id) {
            const subList = activeContainer.shifts;
            const oldIndex = subList.findIndex((sub) => sub.id === active.id);
            const newIndex = subList.findIndex((sub) => sub.id === over.id);

            const updatedSubList = arrayMove(subList, oldIndex, newIndex);
            const updatedSchedules = employeeSchedules.map((schedule) => {
              if (schedule.id === activeContainer.id) {
                schedule.shifts = updatedSubList;
              }

              return schedule;
            });
            setEmployeeSchedules(updatedSchedules);
          } else {
            handleDragForEmployees(
              activeContainer,
              activeContainerPos,
              over,
              overContainerPos,
              overContainer,
              active
            );
          }
        }
      }
    }

    setActive(null);
    setSchedule(null);
  }

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item,
    activeContainerIndex,
    overContainerIndex,
    isDataGiven = false
  ) => {
    const updatedList = {
      ...items,
      [activeContainerIndex]: {
        ...activeContainer,
        shifts: removeAtIndex(items[activeContainerIndex].shifts, activeIndex),
      },
      [overContainerIndex]: {
        ...overContainer,
        shifts: insertAtIndex(
          items[overContainerIndex].shifts,
          overIndex,
          isDataGiven ? item : item.data.current.item
        ),
      },
    };
    return updatedList;
  };

  function handleDragOver(event) {
    const { active, over } = event;
    const { id } = active;
    const activeType = active.data.current.type;
    let overId = null;
    let overType = null;
    if (over) {
      overId = over.id;
      overType = over.data.current.type;
    }

    // Find the containers
    const activeContainer = findContainer(
      id,
      activeType,
      schedulerView === "position" ? schedules : employeeSchedules
    );
    const overContainer = findContainer(
      overId,
      overType,
      schedulerView === "position" ? schedules : employeeSchedules
    );
    if (
      !activeContainer ||
      !overContainer ||
      activeContainer?.id === overContainer?.id
    ) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  }
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [filterDrawer, setFilterDrawer] = useState(false);

  const handleFilterDrawer = (newValue) => {
    setFilterDrawer(newValue);
  };
  const [filterChecklist, setFilterCheckList] = useState([]);
  const [shiftStateFilters, setShiftStateFilters] = useState("Published");
  const [workGroupFilters, setWorkGroupFilters] = useState([]);
  const [positionFilters, setPositionFilters] = useState([]);
  const [timePeriodFilters, setTimePeriodFilters] = useState([]);
  const [onlyShowFilters, setOnlyShowFilters] = useState([]);
  const [timeInFilters, setTimeInFilters] = useState("");
  const [timeOutFilters, setTimeOutFilters] = useState("");
  const [specialTagsFilters, setSpecialTagsFilters] = useState("");

  const handleFilterCheckList = (value) => {
    if (value) {
      setFilterCheckList(value);
    }
  };

  const handleShiftStateFilters = (value) => {
    if (value) {
      setShiftStateFilters(value);
    }
  };

  const handleWorkGroupsFilters = (value) => {
    if (value) {
      setWorkGroupFilters(value);
    }
  };

  const handlePositionFilters = (value) => {
    if (value) {
      setPositionFilters(value);
    }
  };

  const handleTimePeriodFilters = (value) => {
    if (value) {
      setTimePeriodFilters(value);
    }
  };

  const handleOnlyShowFilters = (value) => {
    if (value) {
      setOnlyShowFilters(value);
    }
  };

  const handleTimeInFilters = (value) => {
    if (value) {
      setTimeInFilters(value);
    }
  };

  const handleTimeOutFilters = (value) => {
    if (value) {
      setTimeOutFilters(value);
    }
  };

  const handleSpecialTagsFilters = (value) => {
    if (value) {
      setSpecialTagsFilters(value);
    }
  };

  return (
    <div>
      <Container maxWidth={"xl"} id="pageContainer">
        <h1>Scheduler</h1>
        <Grid container className={styles.schedulerTop}>
          <Grid item xs={9} className={styles.schedulerCarousel}>
            <Carousel
              filterDates={handleDateFilter}
              carouselData={carouselData}
              handleDateFilterWeek={handleDateFilterWeek}
              handleDateFilterMonth={handleDateFilterMonth}
              value={value}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={3} textAlign="right">
            {buttonClick && !isPublished ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  handlePublish();
                }}
              >
                Publish Schedule (1)
              </Button>
            ) : (
              <Button variant="containedDisabled" size="large" disabled>
                Publish Schedule
              </Button>
            )}
          </Grid>
        </Grid>
        <br />
        <div className={styles.schedulerContainer}>
          <Card className={styles.cardContainer}>
            <Grid
              container
              direction="row"
              spacing={0}
              className={classnames(
                "alignBaseline",
                "pagePadding",
                styles.topArea
              )}
            >
              <Grid item xs={2.5}>
                <Tabs
                  style={{ position: "relative", right: "28px" }}
                  className="schedulerViewTabsContainer"
                  value={schedulerView}
                  onChange={handleSchedulerView}
                  textColor="secondary"
                  indicatorColor={""}
                  allowScrollButtonsMobile
                >
                  <Tab
                    value="position"
                    label="By Position"
                    onClick={() => {
                      handleSchedulerView("position");
                    }}
                  />
                  <Tab
                    value="employee"
                    label="By Employee"
                    onClick={() => {
                      handleSchedulerView("employee");
                    }}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={3.5}>
                <div className={styles.weeklySummary}>
                  <img src={BarChartIcon} alt="Bar Chart" />
                  <strong>Weekly Summary</strong>
                  <span>36.5 hrs /</span>
                  <span>$927.44 /</span>
                  <img src={ListIcon} alt="List" />
                  <span>6</span>
                </div>
              </Grid>
              <Grid item xs={1.5}></Grid>
              <Grid item xs={1.75}>
                <FormControl>
                  <Select
                    displayEmpty
                    renderValue={(value) => {
                      return (
                        <Box>
                          <img
                            src={BuildIcon}
                            width={12}
                            height={12}
                            alt="Tools"
                          />
                          {value}
                        </Box>
                      );
                    }}
                    value={optionTools}
                    onChange={handleChangeTools}
                    className={styles.toolsDropDown}
                  >
                    <MenuItem value="Tools"></MenuItem>
                    <MenuItem value="Auto Schedule">
                      <span>Auto Schedule</span>
                    </MenuItem>
                    <MenuItem value="Load Template">
                      <span>Load Template</span>
                    </MenuItem>
                    <MenuItem value="Save Template">
                      <span>Save Template</span>
                    </MenuItem>
                    <MenuItem value="Print">
                      <span>Print</span>
                    </MenuItem>
                    <MenuItem value="Download">
                      <span>Download</span>
                    </MenuItem>
                    <MenuItem value="Clear">
                      <span>Clear</span>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1.75}>
                <FormControl>
                  <Select
                    displayEmpty
                    renderValue={(value) => {
                      return (
                        <Box>
                          <img
                            src={PlusIcon}
                            width={15}
                            height={15}
                            alt="Add"
                          />
                          {value}
                        </Box>
                      );
                    }}
                    value={optionAdd}
                    onChange={handleAdd}
                    className={styles.addDropDown}
                  >
                    <MenuItem value="Add"></MenuItem>
                    <MenuItem value="New Employee">
                      <span>New Employee</span>
                    </MenuItem>
                    <MenuItem value="New Shift">
                      <span>New Shift</span>
                    </MenuItem>
                    <MenuItem value="New RTO Block">
                      <span>New RTO Block</span>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                Filters{" "}
                <FilterListIcon
                  className={styles.filterIcon}
                  onClick={() => {
                    setFilterDrawer(!filterDrawer);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={0}>
              <Grid
                item
                xs={2}
                className={classnames(styles.resourceBox, styles.first)}
              >
                <FormControl style={{ float: "right", marginRight: "20px" }}>
                  <Select
                    displayEmpty
                    renderValue={(value) => {
                      return (
                        <Box>
                          <img
                            src={SortIcon}
                            width={15}
                            height={12}
                            alt="Sort"
                          />
                          {value}
                        </Box>
                      );
                    }}
                    value={optionSort}
                    onChange={handleSort}
                    className={styles.sortDropDown}
                  >
                    <MenuItem value="Sort"></MenuItem>
                    <MenuItem value="A - Z">
                      <span>A - Z</span>
                    </MenuItem>
                    <MenuItem value="Z - A">
                      <span>Z - A</span>
                    </MenuItem>
                    <MenuItem value="Total Hours">
                      <span>Total Hours</span>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10} className={styles.dateHeader}>
                <Grid container>
                  <Grid item xs={boxWidth} className={styles.dateHeaderBox}>
                    <strong
                      className={classnames(
                        todayText === day1Text ? styles.activeDay : ""
                      )}
                    >
                      {day1Text}
                    </strong>
                    <small>13.5 hrs / $351.22</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={SunnyIcon}
                          alt="Sunny"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={boxWidth} className={styles.dateHeaderBox}>
                    <strong
                      className={classnames(
                        todayText === day2Text ? styles.activeDay : ""
                      )}
                    >
                      {day2Text}
                    </strong>
                    <small>9.5 hrs / $225</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={PartlyCloudyIcon}
                          alt="Partly Cloudy"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={boxWidth} className={styles.dateHeaderBox}>
                    <strong
                      className={classnames(
                        todayText === day3Text ? styles.activeDay : ""
                      )}
                    >
                      {day3Text}
                    </strong>
                    <small>13.5 hrs / $351.22</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={SnowIcon}
                          alt="Snow"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={boxWidth} className={styles.dateHeaderBox}>
                    <strong
                      className={classnames(
                        todayText === day4Text ? styles.activeDay : ""
                      )}
                    >
                      {day4Text}
                    </strong>
                    <small>0 hrs / $0</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={ThunderIcon}
                          alt="Thunder"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={boxWidth} className={styles.dateHeaderBox}>
                    <strong
                      className={classnames(
                        todayText === day5Text ? styles.activeDay : ""
                      )}
                    >
                      {day5Text}
                    </strong>
                    <small>0 hrs / $0</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={SunnyIcon}
                          alt="Sunny"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={boxWidth} className={styles.dateHeaderBox}>
                    <strong
                      className={classnames(
                        todayText === day6Text ? styles.activeDay : ""
                      )}
                    >
                      {day6Text}
                    </strong>
                    <small>0 hrs / $0</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={SunnyIcon}
                          alt="Sunny"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={boxWidth}
                    className={classnames(styles.dateHeaderBox, styles.last)}
                  >
                    <strong
                      className={classnames(
                        todayText === day7Text ? styles.activeDay : ""
                      )}
                    >
                      {day7Text}
                    </strong>
                    <small>0 hrs / $0</small>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      justifyContent="space-around"
                      alignItems="baseline"
                      className={styles.bottomInfo}
                    >
                      <Grid item xs={2}>
                        <img
                          src={RainIcon}
                          width={12}
                          height={12}
                          alt="Rain"
                          className={styles.weatherIcon}
                        />
                      </Grid>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={3}>
                        <img src={UserIcon} alt="User" />
                        &nbsp;&nbsp;<span>2</span>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div
              className={styles.calendarContainer}
              id={styles.scrollBarContainer}
            >
              {schedulerView === "position"
                ? allJsonData.map((data, index) => (
                    <Grid container direction="row" spacing={0} key={index}>
                      <Grid
                        item
                        xs={2}
                        className={classnames(styles.resourceBox, styles.first)}
                      >
                        <strong>{data.position}</strong>
                        <p>
                          {data.pos_hours} hrs / ${data.pos_sales} /{" "}
                          {data.pos_notes}
                        </p>
                      </Grid>
                      <Grid item xs={10}>
                        <Grid container direction="row" spacing={0}>
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragCancel={handleDragCancel}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                          >
                            {schedules.map(
                              (schedule, index) =>
                                schedule.date >= beginningOfWeek &&
                                schedule.date <= endOfWeek &&
                                schedule.position === data.position && (
                                  <Grid
                                    item
                                    xs={boxWidth}
                                    key={index}
                                    className={styles.dateBox}
                                  >
                                    <SortableContext
                                      items={schedules}
                                      strategy={horizontalListSortingStrategy}
                                    >
                                      <Droppable
                                        key={index}
                                        list={schedule.shifts}
                                        id={schedule.id}
                                        item={schedule}
                                        position={data.type}
                                        currentDay={currentDay}
                                        beginningOfWeek={beginningOfWeek}
                                        endOfWeek={endOfWeek}
                                        lastParent={
                                          index === schedules.length - 1
                                        }
                                        hasShift={schedule.shifts}
                                        addedNewShift={addedNewShift}
                                        buttonClick={buttonClick}
                                        isPublished={isPublished}
                                        scheduleView={schedulerView}
                                        filterQueryShiftState={
                                          shiftStateFilters
                                        }
                                        filterQueryWorkGroup={workGroupFilters}
                                        filterQueryPosition={positionFilters}
                                        filterQueryTimePeriod={
                                          timePeriodFilters
                                        }
                                        filterQueryOnlyShow={onlyShowFilters}
                                        filterQueryTimeIn={timeInFilters}
                                        filterQueryTimeOut={timeOutFilters}
                                        filterQuerySpecialTags={
                                          specialTagsFilters
                                        }
                                      />
                                    </SortableContext>
                                  </Grid>
                                )
                            )}
                            <DragOverlay>
                              {active ? (
                                <div className={styles.shiftTileDragging}>
                                  <SortableItem
                                    time={schedule.item.time}
                                    name={schedule.item.name}
                                    station={schedule.item.station}
                                    isShift={true}
                                  />
                                </div>
                              ) : null}
                            </DragOverlay>
                          </DndContext>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))
                : allJsonData.map((employee, index) => (
                    <Grid container direction="row" spacing={0} key={index}>
                      <Grid
                        item
                        xs={2}
                        className={classnames(styles.resourceBox, styles.first)}
                      >
                        <Grid container spacing={1}>
                          <Grid item xs={2}>
                            <img
                              src={`/avatars/${employee.avatar}`}
                              alt={employee.name}
                              width="20"
                              height="20"
                            />
                          </Grid>
                          <Grid item xs={10}>
                            <strong>{employee.name}</strong>
                          </Grid>
                        </Grid>
                        <p>
                          {employee.hours} hrs / ${employee.sales} /{" "}
                          {employee.notes}
                        </p>
                      </Grid>
                      <Grid item xs={10}>
                        <Grid container direction="row" spacing={0}>
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragCancel={handleDragCancel}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                          >
                            {employeeSchedules.map(
                              (schedule, index) =>
                                schedule.date >= beginningOfWeek &&
                                schedule.date <= endOfWeek &&
                                schedule.name === employee.name && (
                                  <Grid
                                    item
                                    xs={boxWidth}
                                    key={index}
                                    className={styles.dateBox}
                                  >
                                    <SortableContext
                                      items={employeeSchedules}
                                      strategy={horizontalListSortingStrategy}
                                    >
                                      <Droppable
                                        key={index}
                                        list={schedule.shifts}
                                        id={schedule.id}
                                        item={schedule}
                                        position={employee.position}
                                        currentDay={currentDay}
                                        beginningOfWeek={beginningOfWeek}
                                        endOfWeek={endOfWeek}
                                        lastParent={
                                          index === schedules.length - 1
                                        }
                                        hasShift={schedule.shifts}
                                        addedNewShift={addedNewShift}
                                        buttonClick={buttonClick}
                                        isPublished={isPublished}
                                        scheduleView="employee"
                                        filterQueryShiftState={
                                          shiftStateFilters
                                        }
                                        filterQueryWorkGroup={workGroupFilters}
                                        filterQueryPosition={positionFilters}
                                        filterQueryTimePeriod={
                                          timePeriodFilters
                                        }
                                        filterQueryOnlyShow={onlyShowFilters}
                                        filterQueryTimeIn={timeInFilters}
                                        filterQueryTimeOut={timeOutFilters}
                                        filterQuerySpecialTags={
                                          specialTagsFilters
                                        }
                                      />
                                    </SortableContext>
                                  </Grid>
                                )
                            )}
                            <DragOverlay>
                              {active ? (
                                <div className={styles.shiftTileDragging}>
                                  <SortableItem
                                    time={schedule.item.time}
                                    name={schedule.item.position}
                                    station={schedule.item.station}
                                    isShift={true}
                                  />
                                </div>
                              ) : null}
                            </DragOverlay>
                          </DndContext>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
            </div>
          </Card>
          <Filters
            filterChecklist={filterChecklist}
            shiftStateFilters={shiftStateFilters}
            workGroupFilters={workGroupFilters}
            positionFilters={positionFilters}
            timePeriodFilters={timePeriodFilters}
            onlyShowFilters={onlyShowFilters}
            timeInFilters={timeInFilters}
            timeOutFilters={timeOutFilters}
            specialTagsFilters={specialTagsFilters}
            handleFilterCheckList={handleFilterCheckList}
            handleShiftStateFilters={handleShiftStateFilters}
            handleWorkGroupsFilters={handleWorkGroupsFilters}
            handlePositionFilters={handlePositionFilters}
            handleTimePeriodFilters={handleTimePeriodFilters}
            handleOnlyShowFilters={handleOnlyShowFilters}
            handleTimeInFilters={handleTimeInFilters}
            handleTimeOutFilters={handleTimeOutFilters}
            handleSpecialTagsFilters={handleSpecialTagsFilters}
            filterDrawer={filterDrawer}
            handleFilterDrawer={handleFilterDrawer}
          />
        </div>
      </Container>
    </div>
  );
}
