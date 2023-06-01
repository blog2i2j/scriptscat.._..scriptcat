import IoC from "@App/app/ioc";
import ScriptController from "@App/app/service/script/controller";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Message,
  Modal,
  Space,
  Typography,
} from "@arco-design/web-react";
import { RefInputType } from "@arco-design/web-react/es/Input/interface";
import {
  IconDesktop,
  IconDown,
  IconGithub,
  IconLink,
  IconMoonFill,
  IconSunFill,
} from "@arco-design/web-react/icon";
import { editor } from "monaco-editor";
import React, { ReactNode, useRef, useState } from "react";
import {
  RiFileCodeLine,
  RiTerminalBoxLine,
  RiTimerLine,
  RiLinkM,
  RiPlayListAddLine,
} from "react-icons/ri";
import "./index.css";

export function switchLight(mode: string) {
  if (mode === "auto") {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    const isMatch = (match: boolean) => {
      if (match) {
        document.body.setAttribute("arco-theme", "dark");
        editor.setTheme("vs-dark");
      } else {
        document.body.removeAttribute("arco-theme");
        editor.setTheme("vs");
      }
    };
    darkThemeMq.addEventListener("change", (e) => {
      isMatch(e.matches);
    });
    isMatch(darkThemeMq.matches);
  } else {
    document.body.setAttribute("arco-theme", mode);
    editor.setTheme(mode === "dark" ? "vs-dark" : "vs");
  }
}

const MainLayout: React.FC<{
  children: ReactNode;
  className: string;
  pageName: string;
}> = ({ children, className, pageName }) => {
  const [lightMode, setLightMode] = useState(localStorage.lightMode || "auto");
  const importRef = useRef<RefInputType>(null);
  const [importVisible, setImportVisible] = useState(false);
  switchLight(lightMode);
  return (
    <Layout>
      <Layout.Header
        style={{
          height: "50px",
          borderBottom: "1px solid var(--color-neutral-3)",
        }}
        className="flex items-center justify-between p-x-4"
      >
        <Modal
          title="链接导入"
          visible={importVisible}
          onOk={async () => {
            const scriptCtl = IoC.instance(
              ScriptController
            ) as ScriptController;
            try {
              await scriptCtl.importByUrl(importRef.current!.dom.value);
            } catch (e) {
              Message.error(`链接导入失败: ${e}`);
            }
            setImportVisible(false);
          }}
          onCancel={() => {
            setImportVisible(false);
          }}
        >
          <Input ref={importRef} defaultValue="" />
        </Modal>
        <div className="flex row items-center">
          <img
            style={{ height: "40px" }}
            src="/assets/logo.png"
            alt="ScriptCat"
          />
          <Typography.Title heading={4} className="!m-0">
            ScriptCat
          </Typography.Title>
        </div>
        <Space size="small" className="action-tools">
          {pageName === "options" && (
            <Dropdown
              droplist={
                <Menu style={{ maxHeight: "100%", width: "calc(100% + 10px)" }}>
                  <Menu.Item key="/script/editor">
                    <a href="#/script/editor">
                      <RiFileCodeLine /> 添加普通脚本
                    </a>
                  </Menu.Item>
                  <Menu.Item key="background">
                    <a href="#/script/editor?template=background">
                      <RiTerminalBoxLine /> 添加后台脚本
                    </a>
                  </Menu.Item>
                  <Menu.Item key="crontab">
                    <a href="#/script/editor?template=crontab">
                      <RiTimerLine /> 添加定时脚本
                    </a>
                  </Menu.Item>
                  <Menu.Item
                    key="link"
                    onClick={() => {
                      setImportVisible(true);
                    }}
                  >
                    <IconLink /> 链接导入
                  </Menu.Item>
                </Menu>
              }
              position="bl"
            >
              <Button
                type="text"
                size="small"
                style={{
                  color: "var(--color-text-1)",
                }}
                className="!text-size-sm"
              >
                <RiPlayListAddLine /> 新建脚本 <IconDown />
              </Button>
            </Dropdown>
          )}
          {pageName === "options" && (
            <Dropdown
              droplist={
                // 取消最大高度限制防止内容过多出现滚动条 / 增加10px宽度提升美观  下同
                <Menu style={{ maxHeight: "100%", width: "calc(100% + 10px)" }}>
                  <Menu.Item key="scriptcat/docs/use/">
                    <a
                      href="https://docs.scriptcat.org/docs/use/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <RiFileCodeLine /> 使用指南
                    </a>
                  </Menu.Item>
                  <Menu.Item key="scriptcat/docs/dev/">
                    <a
                      href="https://docs.scriptcat.org/docs/dev/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <RiFileCodeLine /> API文档
                    </a>
                  </Menu.Item>
                  <Menu.Item key="scriptcat/docs/learn/">
                    <a
                      href="https://learn.scriptcat.org/docs/%E7%AE%80%E4%BB%8B/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <RiFileCodeLine /> 开发指南
                    </a>
                  </Menu.Item>
                  <Menu.Item key="scriptcat/userscript">
                    <a
                      href="https://scriptcat.org/search"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconLink /> 脚本站
                    </a>
                  </Menu.Item>
                  <Menu.Item key="tampermonkey/bbs">
                    <a
                      href="https://bbs.tampermonkey.net.cn/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconLink /> 社区论坛
                    </a>
                  </Menu.Item>
                  <Menu.Item key="GitHub">
                    <a
                      href="https://github.com/scriptscat/scriptcat"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconGithub /> GitHub
                    </a>
                  </Menu.Item>
                </Menu>
              }
              position="bl"
            >
              <Button
                type="text"
                size="small"
                style={{
                  color: "var(--color-text-1)",
                }}
                className="!text-size-sm"
              >
                <RiLinkM /> 外部链接 <IconDown />
              </Button>
            </Dropdown>
          )}
          <Dropdown
            droplist={
              <Menu
                onClickMenuItem={(key) => {
                  switchLight(key);
                  setLightMode(key);
                  localStorage.lightMode = key;
                }}
                selectedKeys={[lightMode]}
              >
                <Menu.Item key="light">
                  <IconSunFill /> Light
                </Menu.Item>
                <Menu.Item key="dark">
                  <IconMoonFill /> Dark
                </Menu.Item>
                <Menu.Item key="auto">
                  <IconDesktop /> 跟随系统
                </Menu.Item>
              </Menu>
            }
            position="bl"
          >
            <Button
              type="text"
              size="small"
              icon={
                <>
                  {lightMode === "auto" && <IconDesktop />}
                  {lightMode === "light" && <IconSunFill />}
                  {lightMode === "dark" && <IconMoonFill />}
                </>
              }
              style={{
                color: "var(--color-text-1)",
              }}
              className="!text-size-lg"
            />
          </Dropdown>
        </Space>
      </Layout.Header>
      <Layout
        className={`absolute top-50px bottom-0 w-full ${className}`}
        style={{
          background: "var(--color-fill-2)",
        }}
      >
        {children}
      </Layout>
    </Layout>
  );
};

export default MainLayout;
