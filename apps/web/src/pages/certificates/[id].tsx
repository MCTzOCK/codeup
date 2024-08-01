/**
 * apps/web/src/pages/certificates/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.11.2022
 *
 */

import * as React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import REST from "@codeup/rest";
import {
  Box,
  Flex,
  Heading,
  Text,
  useToast,
  chakra,
  ButtonGroup,
  Button,
  useDisclosure,
  Stack,
  Input,
  Image,
} from "@chakra-ui/react";
import CodeUpModal from "@codeup/components/codeup/CodeUpModal";
import { useLoggedIn } from "@codeup/hooks";
import Head from "next/head";
import { CHeading } from "@codeup/components/global/CHeading";
import { sProp } from "../../global/i18nstaticProps";
import { useTranslation } from "next-i18next";

export default function CertViewer() {
  const router = useRouter();

  const { t } = useTranslation("certificates");

  const { userInfo, loggedIn, loaded } = useLoggedIn();

  const { id } = router.query;

  const [steps, setSteps] = React.useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (id && loggedIn && loaded) {
      REST.Certificates.getCertificate({
        token: localStorage.getItem("token") as string,
        onlyLookup: false,
        course: id as string,
      }).then((res) => {
        if (res.status === 200) {
          setSteps(res.payload.certificate.steps);
        } else {
          toast({
            title: t("base:control.error"),
            description: t("certificate.loading.error"),
            status: "error",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
          });
        }
      });
    }
  }, [id, loggedIn, loaded]);

  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/");
      window.dispatchEvent(new CustomEvent("codeup::open_login"));
    }
  }, [userInfo, loggedIn, loaded]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentStep, setCurrentStep] = React.useState(0);

  const [answers, setAnswers] = React.useState<any[]>([]);

  const [finishButtonLoading, setFinishButtonLoading] = React.useState(false);

  React.useEffect(() => {
    console.log(answers);
  }, [answers]);

  return (
    <>
      <Head>
        <title>{t("certificate.doc.title")}</title>
      </Head>
      <Flex
        w={"100%"}
        h={"fit-content"}
        minH={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
        bg={"#000"}
      >
        <Box maxW={["90%", "30%"]}>
          <Box textAlign={"center"}>
            <CHeading size={"2xl"}>{t("certificate")}</CHeading>
          </Box>
          <Text fontSize="2xl" mt={8} textAlign={"center"}>
            {t("c.text.0")}
            <br />
            <chakra.span color={"brand.500"} fontWeight={"bold"}>
              {t("c.text.1")}
            </chakra.span>
            &nbsp;{t("c.text.2")}
          </Text>
          <ButtonGroup
            mt={10}
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
          >
            <Button
              size={"lg"}
              variant={"brand"}
              onClick={() => {
                onOpen();
                setCurrentStep(0);
                setAnswers([]);
              }}
            >
              {t("certificate.apply")}
            </Button>
          </ButtonGroup>
        </Box>
      </Flex>

      <CodeUpModal
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        noCloseButton
        blackBackground={true}
        title={`${t("certificate.apply")} (${t("step")} ${
          currentStep === steps.length
            ? steps.length + "/" + steps.length + ")"
            : currentStep + 1 + "/" + steps.length + ")"
        }`}
        customSize={["full", "5xl"]}
      >
        <>
          {steps[currentStep] && (
            <>
              {steps[currentStep].step_type === "MULTIPLE_CHOICE" && (
                <>
                  <CHeading size="xl" mt={2} textAlign={"center"}>
                    {steps[currentStep].multiple_choice.question}
                  </CHeading>
                  <Stack mt={8}>
                    {steps[currentStep].multiple_choice.answers.map(
                      (a: any, i: any) => {
                        return (
                          <>
                            <Button
                              variant={"solid"}
                              onClick={() => {
                                setAnswers([
                                  ...answers,
                                  {
                                    step: currentStep,
                                    answer: i,
                                  },
                                ]);
                                setCurrentStep(currentStep + 1);
                              }}
                              rounded={"md"}
                            >
                              {a.answer}
                            </Button>
                          </>
                        );
                      }
                    )}
                  </Stack>
                </>
              )}
              {steps[currentStep].step_type === "TEXT" && (
                <>
                  <CHeading size={"xl"} textAlign={"center"} mt={8}>
                    {steps[currentStep].step_title}
                  </CHeading>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;

                      const data = new FormData(form);

                      setAnswers([
                        ...answers,
                        {
                          step: currentStep,
                          ...Object.fromEntries(data),
                        },
                      ]);

                      setCurrentStep(currentStep + 1);
                    }}
                  >
                    {steps[currentStep].text_parts.map((t: any) => (
                      <>
                        {t.type === "TEXT" && (
                          <>
                            <Text mt={8} fontSize={"xl"}>
                              {t.value}
                            </Text>
                          </>
                        )}
                        {t.type === "INPUT" && (
                          <>
                            <Input mt={8} name={t.id} />
                          </>
                        )}
                      </>
                    ))}
                    <ButtonGroup w={"100%"} mt={8}>
                      <Button w={"100%"} variant={"brand"} type={"submit"}>
                        {t("next")}
                      </Button>
                    </ButtonGroup>
                  </form>
                </>
              )}

              {steps[currentStep].step_type === "CODE_CHECK" && (
                <>
                  <CHeading size={"xl"} textAlign={"center"} mt={8}>
                    {steps[currentStep].step_title}
                  </CHeading>
                  <Flex
                    direction={"column"}
                    w={"100%"}
                    h={"fit-content"}
                    paddingInline={10}
                    paddingBlock={5}
                    gap={40}
                  >
                    <Box flex={"100%"}>
                      <Stack>
                        <CHeading size={"lg"}>{t("code.correct")}</CHeading>
                        <Image
                          src={steps[currentStep].code_check?.screenshot}
                          alt={t("code.screenshot")}
                        />
                      </Stack>
                    </Box>
                    <Box flex={"100%"}>
                      <form>
                        <ButtonGroup w={"100%"}>
                          <Button
                            w={"100%"}
                            colorScheme={"red"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: false,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            {t("right")}
                          </Button>
                          <Button
                            w={"100%"}
                            colorScheme={"green"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: true,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            {t("wrong")}
                          </Button>
                        </ButtonGroup>
                      </form>
                    </Box>
                  </Flex>
                </>
              )}
              {steps[currentStep].step_type === "CODE_COMPARE" && (
                <>
                  <CHeading size={"xl"} textAlign={"center"}>
                    {steps[currentStep].step_title}
                  </CHeading>
                  <Flex
                    direction={"column"}
                    w={"100%"}
                    h={"fit-content"}
                    paddingInline={10}
                    paddingBlock={5}
                    gap={40}
                  >
                    <Box flex={"100%"}>
                      <Stack>
                        <CHeading size={"lg"}>{t("which.code")}</CHeading>
                        <Image
                          src={steps[currentStep].code_compare?.output}
                          alt={t("output.image")}
                        />
                      </Stack>
                      <Stack>
                        <CHeading size={"lg"}>{t("code.1")}</CHeading>
                        <Image
                          src={
                            steps[currentStep].code_compare?.code_a.screenshot
                          }
                          alt="Code 1 Screenshot"
                        />
                        <CHeading size={"lg"}>{t("code.2")}</CHeading>
                        <Image
                          src={
                            steps[currentStep].code_compare?.code_b.screenshot
                          }
                          alt="Code 2 Screenshot"
                        />
                      </Stack>
                    </Box>
                    <Box flex={"100%"}>
                      <form>
                        <ButtonGroup w={"100%"}>
                          <Button
                            w={"100%"}
                            colorScheme={"red"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: 0,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            {t("code.1")}
                          </Button>
                          <Button
                            w={"100%"}
                            colorScheme={"green"}
                            onClick={() => {
                              setAnswers([
                                ...answers,
                                {
                                  step: currentStep,
                                  answer: 1,
                                },
                              ]);
                              setCurrentStep(currentStep + 1);
                            }}
                          >
                            {t("code.2")}
                          </Button>
                        </ButtonGroup>
                      </form>
                    </Box>
                  </Flex>
                </>
              )}
            </>
          )}
          {currentStep === steps.length && (
            <>
              <Box textAlign={"center"} pt={4}>
                <CHeading size={"2xl"}>{t("certificate.apply")}</CHeading>
              </Box>
              <Text fontSize="2xl" mt={8} textAlign={"center"}>
                {t("certificate.apply.finish")}
              </Text>
              <ButtonGroup
                mt={10}
                alignItems={"center"}
                justifyContent={"center"}
                w={"100%"}
              >
                <Button
                  size={"lg"}
                  variant={"brand"}
                  isLoading={finishButtonLoading}
                  onClick={async () => {
                    setFinishButtonLoading(true);

                    const res = await REST.Certificates.submitCertificate({
                      token: localStorage.getItem("token") as string,
                      course: id as string,
                      answers,
                    });

                    if (res.status === 200) {
                      if (res.payload.obtainedCertificate) {
                        router.push(
                          "/user-cert/" + res.payload.obtainedCertificateId
                        );
                      } else {
                        router.push(
                          `/error?error=${t("certificate.apply.to.low.points")}`
                        );
                      }
                    } else {
                      setFinishButtonLoading(false);
                      toast({
                        title: t("base:control.error"),
                        description:
                          t("certificate.apply.error") +
                          " " +
                          res.payload.error,
                        status: "error",
                        duration: 1500,
                        isClosable: true,
                        position: "bottom-right",
                      });
                    }
                  }}
                >
                  {t("certificate.apply")}
                </Button>
              </ButtonGroup>
            </>
          )}
        </>
      </CodeUpModal>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    ...(await sProp(locale, ["certificates"])),
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
