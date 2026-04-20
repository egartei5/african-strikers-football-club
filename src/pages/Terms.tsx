import { motion } from "motion/react";
import { PageHeader } from "@/components/PageHeader";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Terms() {
  useDocumentTitle("Terms of Service");

  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing and using the African Strikers FC website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.`,
    },
    {
      title: "Use of the Website",
      content: `You may use this website for lawful purposes only. You agree not to:

• Use the website in any way that could damage or impair its functionality
• Attempt to gain unauthorised access to any part of the website or its systems
• Transmit any harmful, offensive, or unlawful content through our contact or application forms
• Use automated tools to scrape or harvest data from the website without permission`,
    },
    {
      title: "Player Applications",
      content: `By submitting a player trial application through our website, you confirm that all information provided is accurate and truthful. Submission of an application does not guarantee a trial invitation. African Strikers FC reserves the right to accept or decline applications at its sole discretion. Applications are reviewed by our coaching staff and a response will be provided within a reasonable timeframe.`,
    },
    {
      title: "Newsletter Subscriptions",
      content: `By subscribing to our newsletter, you consent to receiving periodic emails from African Strikers FC containing club news, match updates, and announcements. You may unsubscribe at any time by contacting us at info@africanstrikersfc.com. We will process your unsubscribe request promptly.`,
    },
    {
      title: "Intellectual Property",
      content: `All content on this website — including text, images, logos, graphics, and design — is the property of African Strikers FC or its content contributors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content from this website without prior written permission from African Strikers FC.`,
    },
    {
      title: "Disclaimer of Warranties",
      content: `This website is provided on an "as is" basis. African Strikers FC makes no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the website or its content. We reserve the right to modify, suspend, or discontinue any aspect of the website at any time without notice.`,
    },
    {
      title: "Limitation of Liability",
      content: `African Strikers FC shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or its content. This includes, but is not limited to, errors or omissions in content, loss of data, or technical issues.`,
    },
    {
      title: "External Links",
      content: `This website may contain links to third-party websites. These links are provided for convenience only. African Strikers FC has no control over, and accepts no responsibility for, the content or privacy practices of any linked external sites.`,
    },
    {
      title: "Changes to These Terms",
      content: `We reserve the right to update these Terms of Service at any time. Any changes will be reflected on this page with an updated date. Continued use of the website after any modifications constitutes acceptance of the revised terms.`,
    },
    {
      title: "Contact",
      content: `If you have any questions about these Terms of Service, please contact us:

Email: info@africanstrikersfc.com
Location: Brooklyn Park, Minnesota, USA`,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Legal"
        title="Terms of Service"
        subtitle="The rules and conditions that govern your use of the African Strikers FC website."
      />

      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-slate-400 text-sm mb-12 border-l-2 border-teal-500 pl-4"
          >
            Last updated: April 2026. These terms apply to all users of the African Strikers FC website.
          </motion.p>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2 className="font-display text-2xl uppercase tracking-wider text-white mb-4">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
