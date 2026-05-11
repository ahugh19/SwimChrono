import React, { useEffect, useRef, useState } from 'react';
import NavBtns from "../../components/NavBtns"
import Header from '../../components/Header';
import LayerPanel from '../../components/LayerPanel';
import ControllerPanel from '../../components/ControllerPanel';
import VideoPanel from '../../components/VideoPanel';
import styles from "./index.module.less"
import { inject, observer } from "mobx-react"
import { IComponentPropsWithStore, Store } from "../../store"
import { Button, Divider, Space, Tour, FloatButton, notification } from 'antd';
import { QuestionCircleOutlined, FieldTimeOutlined, EyeOutlined, CopyOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TourProps } from 'antd';


interface AboutProps extends IComponentPropsWithStore {

}

function About(props: AboutProps) {
  const { store } = props;


  return (
    <div>
      About
      <p>
        This project uses browser compatibility data from caniuse.com (licensed under CC-BY-4.0).
      </p>
    </div>
  )
}

export default About;
